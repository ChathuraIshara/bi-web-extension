#!/usr/bin/env python

# Copyright 2011-2022 Eric Wendelin
#
# This is free software, licensed under the Apache License, Version 2.0,
# available in the accompanying LICENSE.txt file.

"""
Converts lcov line coverage output to Cobertura-compatible XML for CI
"""

import re
import sys
import os
import time
import subprocess  # nosec - not for untrusted input

from xml.dom import minidom  # nosec - not for untrusted input
from optparse import OptionParser

from distutils.spawn import find_executable

__version__ = '2.0.1'

CPPFILT = "c++filt"
HAVE_CPPFILT = False

if find_executable(CPPFILT) is not None:
    HAVE_CPPFILT = True


class Demangler():
    def __init__(self):
        self.pipe = subprocess.Popen(  # nosec - not for untrusted input
            [CPPFILT], stdin=subprocess.PIPE, stdout=subprocess.PIPE)

    def demangle(self, name):
        newname = name + "\n"
        self.pipe.stdin.write(newname.encode('utf-8'))
        self.pipe.stdin.flush()
        res = self.pipe.stdout.readline().decode('utf-8')
        return res.rstrip()

    def __del__(self):
        self.pipe.stdin.close()
        self.pipe.terminate()
        self.pipe.wait()


class LcovCobertura():
    """
    Converts code coverage report files in lcov format to Cobertura's XML
    report format so that CI servers like Jenkins can aggregate results and
    determine build stability etc.

    >>> from lcov_cobertura import LcovCobertura
    >>> LCOV_INPUT = 'your lcov input'
    >>> converter = LcovCobertura(LCOV_INPUT)
    >>> cobertura_xml = converter.convert()
    >>> print(cobertura_xml)
    <?xml version="1.0" ?>
    <!DOCTYPE coverage
      SYSTEM 'http://cobertura.sourceforge.net/xml/coverage-04.dtd'>
      ...
    """

    def __init__(self, lcov_data, base_dir='.', excludes=None, demangle=False):
        """
        Create a new :class:`LcovCobertura` object using the given `lcov_data`
        and `options`.

        :param lcov_data: Path to LCOV data file
        :type lcov_data: string
        :param base_dir: Path upon which to base all sources
        :type base_dir: string
        :param excludes: list of regexes to packages as excluded
        :type excludes: [string]
        :param demangle: whether to demangle function names using c++filt
        :type demangle: bool
        """

        if not excludes:
            excludes = []
        self.lcov_data = lcov_data
        self.base_dir = base_dir
        self.excludes = excludes
        if demangle:
            demangler = Demangler()
            self.format = demangler.demangle
        else:
            self.format = lambda x: x

    def convert(self):
        """
        Convert lcov file to cobertura XML using options from this instance.
        """
        coverage_data = self.parse()
        return self.generate_cobertura_xml(coverage_data)

    def parse(self, **kwargs):
        """
        Generate a data structure representing it that can be serialized in any
        logical format.
        """

        coverage_data = {
            'packages': {},
            'summary': {'lines-total': 0, 'lines-covered': 0,
                        'branches-total': 0, 'branches-covered': 0},
            'timestamp': str(kwargs["timestamp"]) if "timestamp" in kwargs else str(int(time.time()))
        }
        package = None
        current_file = None
        file_lines_total = 0
        file_lines_covered = 0
        file_lines = {}
        file_methods = {}
        file_branches_total = 0
        file_branches_covered = 0

        for line in self.lcov_data.split('\n'):
            if line.strip() == 'end_of_record':
                if current_file is not None:
                    package_dict = coverage_data['packages'][package]
                    package_dict['lines-total'] += file_lines_total
                    package_dict['lines-covered'] += file_lines_covered
                    package_dict['branches-total'] += file_branches_total
                    package_dict['branches-covered'] += file_branches_covered
                    file_dict = package_dict['classes'][current_file]
                    file_dict['lines-total'] = file_lines_total
                    file_dict['lines-covered'] = file_lines_covered
                    file_dict['lines'] = dict(file_lines)
                    file_dict['methods'] = dict(file_methods)
                    file_dict['branches-total'] = file_branches_total
                    file_dict['branches-covered'] = file_branches_covered
                    coverage_data['summary']['lines-total'] += file_lines_total
                    coverage_data['summary']['lines-covered'] += file_lines_covered
                    coverage_data['summary']['branches-total'] += file_branches_total
                    coverage_data['summary']['branches-covered'] += file_branches_covered

            line_parts = line.split(':', 1)
            input_type = line_parts[0]

            if input_type == 'SF':
                # Get file name
                file_name = line_parts[-1].strip()
                relative_file_name = os.path.relpath(file_name, self.base_dir)
                package = '.'.join(relative_file_name.split(os.path.sep)[0:-1])
                class_name = '.'.join(relative_file_name.split(os.path.sep))
                if package not in coverage_data['packages']:
                    coverage_data['packages'][package] = {
                        'classes': {}, 'lines-total': 0, 'lines-covered': 0,
                        'branches-total': 0, 'branches-covered': 0
                    }
                coverage_data['packages'][package]['classes'][
                    relative_file_name] = {
                        'name': class_name, 'lines': {}, 'lines-total': 0,
                        'lines-covered': 0, 'branches-total': 0,
                        'branches-covered': 0
                }
                package = package
                current_file = relative_file_name
                file_lines_total = 0
                file_lines_covered = 0
                file_lines.clear()
                file_methods.clear()
                file_branches_total = 0
                file_branches_covered = 0
            elif input_type == 'DA':
                # DA:2,0
                (line_number, line_hits) = line_parts[-1].strip().split(',')
                line_number = int(line_number)
                if line_number not in file_lines:
                    file_lines[line_number] = {
                        'branch': 'false', 'branches-total': 0,
                        'branches-covered': 0
                    }
                file_lines[line_number]['hits'] = line_hits
                # Increment lines total/covered for class and package
                try:
                    if int(line_hits) > 0:
                        file_lines_covered += 1
                except ValueError:
                    pass
                file_lines_total += 1
            elif input_type == 'BRDA':
                # BRDA:1,1,2,0
                (line_number, block_number, branch_number, branch_hits) = line_parts[-1].strip().split(',')
                line_number = int(line_number)
                if line_number not in file_lines:
                    file_lines[line_number] = {
                        'branch': 'true', 'branches-total': 0,
                        'branches-covered': 0, 'hits': 0
                    }
                file_lines[line_number]['branch'] = 'true'
                file_lines[line_number]['branches-total'] += 1
                file_branches_total += 1
                if branch_hits != '-' and int(branch_hits) > 0:
                    file_lines[line_number]['branches-covered'] += 1
                    file_branches_covered += 1
            elif input_type == 'BRF':
                file_branches_total = int(line_parts[1])
            elif input_type == 'BRH':
                file_branches_covered = int(line_parts[1])
            elif input_type == 'FN':
                # FN:5,(anonymous_1)
                function_line, function_name = line_parts[-1].strip().split(',', 1)
                file_methods[function_name] = [function_line, '0']
            elif input_type == 'FNDA':
                # FNDA:0,(anonymous_1)
                (function_hits, function_name) = line_parts[-1].strip().split(',', 1)
                if function_name not in file_methods:
                    file_methods[function_name] = ['0', '0']
                file_methods[function_name][-1] = function_hits

        # Exclude packages
        excluded = [x for x in coverage_data['packages'] for e in self.excludes
                    if re.match(e, x)]
        for package in excluded:
            del coverage_data['packages'][package]

        # Compute line coverage rates
        for package_data in list(coverage_data['packages'].values()):
            package_data['line-rate'] = self._percent(
                package_data['lines-total'],
                package_data['lines-covered'])
            package_data['branch-rate'] = self._percent(
                package_data['branches-total'],
                package_data['branches-covered'])

        return coverage_data

    def generate_cobertura_xml(self, coverage_data, **kwargs):
        """
        Given parsed coverage data, return a String cobertura XML representation.

        :param coverage_data: Nested dict representing coverage information.
        :type coverage_data: dict
        """

        dom_impl = minidom.getDOMImplementation()
        doctype = dom_impl.createDocumentType("coverage", None,
                                              "http://cobertura.sourceforge.net/xml/coverage-04.dtd")
        document = dom_impl.createDocument(None, "coverage", doctype)
        root = document.documentElement
        summary = coverage_data['summary']
        self._attrs(root, {
            'branch-rate': self._percent(summary['branches-total'],
                                         summary['branches-covered']),
            'branches-covered': str(summary['branches-covered']),
            'branches-valid': str(summary['branches-total']),
            'complexity': '0',
            'line-rate': self._percent(summary['lines-total'],
                                       summary['lines-covered']),
            'lines-covered': str(summary['lines-covered']),
            'lines-valid': str(summary['lines-total']),
            'timestamp': coverage_data['timestamp'],
            'version': '2.0.3'
        })

        sources = self._el(document, 'sources', {})
        source = self._el(document, 'source', {})
        source.appendChild(document.createTextNode(self.base_dir))
        sources.appendChild(source)

        root.appendChild(sources)

        packages_el = self._el(document, 'packages', {})

        packages = coverage_data['packages']
        for package_name, package_data in list(packages.items()):
            package_el = self._el(document, 'package', {
                'line-rate': package_data['line-rate'],
                'branch-rate': package_data['branch-rate'],
                'name': package_name,
                'complexity': '0',
            })
            classes_el = self._el(document, 'classes', {})
            for class_name, class_data in list(package_data['classes'].items()):
                class_el = self._el(document, 'class', {
                    'branch-rate': self._percent(class_data['branches-total'],
                                                 class_data['branches-covered']),
                    'complexity': '0',
                    'filename': class_name,
                    'line-rate': self._percent(class_data['lines-total'],
                                               class_data['lines-covered']),
                    'name': class_data['name']
                })

                # Process methods
                methods_el = self._el(document, 'methods', {})
                for method_name, (line, hits) in list(class_data['methods'].items()):
                    method_el = self._el(document, 'method', {
                        'name': self.format(method_name),
                        'signature': '',
                        'line-rate': '1.0' if int(hits) > 0 else '0.0',
                        'branch-rate': '1.0' if int(hits) > 0 else '0.0',
                    })
                    method_lines_el = self._el(document, 'lines', {})
                    method_line_el = self._el(document, 'line', {
                        'hits': hits,
                        'number': line,
                        'branch': 'false',
                    })
                    method_lines_el.appendChild(method_line_el)
                    method_el.appendChild(method_lines_el)
                    methods_el.appendChild(method_el)

                # Process lines
                lines_el = self._el(document, 'lines', {})
                lines = list(class_data['lines'].keys())
                lines.sort()
                for line_number in lines:
                    line_el = self._el(document, 'line', {
                        'branch': class_data['lines'][line_number]['branch'],
                        'hits': str(class_data['lines'][line_number]['hits']),
                        'number': str(line_number)
                    })
                    if class_data['lines'][line_number]['branch'] == 'true':
                        total = int(class_data['lines'][line_number]['branches-total'])
                        covered = int(class_data['lines'][line_number]['branches-covered'])
                        percentage = int((covered * 100.0) / total)
                        line_el.setAttribute('condition-coverage',
                                             '{0}% ({1}/{2})'.format(
                                                 percentage, covered, total))
                    lines_el.appendChild(line_el)

                class_el.appendChild(methods_el)
                class_el.appendChild(lines_el)
                classes_el.appendChild(class_el)
            package_el.appendChild(classes_el)
            packages_el.appendChild(package_el)
        root.appendChild(packages_el)

        return document.toprettyxml(**kwargs)

    def _el(self, document, name, attrs):
        """
        Create an element within document with given name and attributes.

        :param document: Document element
        :type document: Document
        :param name: Element name
        :type name: string
        :param attrs: Attributes for element
        :type attrs: dict
        """
        return self._attrs(document.createElement(name), attrs)

    def _attrs(self, element, attrs):
        """
        Set attributes on given element.

        :param element: DOM Element
        :type element: Element
        :param attrs: Attributes for element
        :type attrs: dict
        """
        for attr, val in list(attrs.items()):
            element.setAttribute(attr, val)
        return element

    def _percent(self, lines_total, lines_covered):
        """
        Get the percentage of lines covered in the total, with formatting.

        :param lines_total: Total number of lines in given module
        :type lines_total: number
        :param lines_covered: Number of lines covered by tests in module
        :type lines_covered: number
        """

        if lines_total == 0:
            return '0.0'
        return str(float(float(lines_covered) / float(lines_total)))


def main(argv=None):
    """
    Converts LCOV coverage data to Cobertura-compatible XML for reporting.

    Usage:
        lcov_cobertura.py lcov-file.dat
        lcov_cobertura.py lcov-file.dat -b src/dir -e test.lib -o path/out.xml

    By default, XML output will be written to ./coverage.xml
    """
    if argv is None:
        argv = sys.argv
    parser = OptionParser()
    parser.usage = ('lcov_cobertura.py lcov-file.dat [-b source/dir] '
                    '[-e <exclude packages regex>] [-o output.xml] [-d]')
    parser.description = 'Converts lcov output to cobertura-compatible XML'
    parser.add_option('-b', '--base-dir', action='store',
                      help='Directory where source files are located',
                      dest='base_dir', default='.')
    parser.add_option('-e', '--excludes',
                      help='Comma-separated list of regexes of packages to exclude',
                      action='append', dest='excludes', default=[])
    parser.add_option('-o', '--output',
                      help='Path to store cobertura xml file',
                      action='store', dest='output', default='coverage.xml')
    parser.add_option('-d', '--demangle',
                      help='Demangle C++ function names using %s' % CPPFILT,
                      action='store_true', dest='demangle', default=False)
    parser.add_option('-v', '--version',
                      help='Display version info',
                      action='store_true')
    (options, args) = parser.parse_args(args=argv)

    if options.demangle and not HAVE_CPPFILT:
        raise RuntimeError("C++ filter executable (%s) not found!" % CPPFILT)
    if options.version:
        print('[lcov_cobertura {}]'.format(__version__))
        sys.exit(0)

    if len(args) != 2:
        print(main.__doc__)
        sys.exit(1)

    try:
        with open(args[1], 'r') as lcov_file:
            lcov_data = lcov_file.read()
            lcov_cobertura = LcovCobertura(lcov_data, options.base_dir, options.excludes, options.demangle)
            cobertura_xml = lcov_cobertura.convert()
        with open(options.output, mode='wt') as output_file:
            output_file.write(cobertura_xml)
    except IOError:
        sys.stderr.write("Unable to convert %s to Cobertura XML" % args[1])


if __name__ == '__main__':
    main()