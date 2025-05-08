/**
 * Copyright (c) 2018, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */


import { cloneDeep, debounce } from "lodash";
import * as React from "react";
import { Form, Grid, Header, Input, List } from "semantic-ui-react";
import { BallerinaExampleCategory } from "./model";

export interface SamplesListState {
    samples?: BallerinaExampleCategory[];
    searchQuery?: string;
    noSearchReults?: boolean;
}

export interface SamplesListProps {
    openSample: (url: string) => void;
    getSamples: () => Promise<BallerinaExampleCategory[]>;
}

/**
 * React component for rendering a list of Ballerina examples.
 *
 * @class SamplesList
 * @extends {Component}
 */
export class SamplesList extends React.Component<SamplesListProps, SamplesListState> {

    private availableSamples: undefined | BallerinaExampleCategory[];
    private searchInput: Input | undefined;
    private onSearchQueryEdit: () => void;

    constructor(props: SamplesListProps, context: SamplesListState) {
        super(props, context);
        this.onSearchQueryEdit = debounce(() => {
            const { searchQuery } = this.state;
            if (searchQuery !== undefined && this.availableSamples) {
                let samples = cloneDeep(this.availableSamples);
                samples = samples.filter((sampleCategory) => {
                    if (!sampleCategory.title.toLowerCase().includes(searchQuery)) {
                        sampleCategory.samples = sampleCategory
                            .samples.filter((sample) => sample.name.toLowerCase().includes(searchQuery));
                    }
                    return sampleCategory.samples.length !== 0;
                });
                if (samples.length === 0) {
                    samples = cloneDeep(this.availableSamples);
                    this.setState({
                        noSearchReults: true
                    });
                } else {
                    this.setState({
                        noSearchReults: false
                    });
                }
                this.setState({
                    samples
                });
            }
        }, 500).bind(this);
    }

    public componentDidMount() {
        this.focusOnSearchInput();
        this.props.getSamples().then((samples) => {
            this.availableSamples = samples;
            this.setState({
                samples,
            });
        });
    }

    public componentWillReceiveProps(nextProps: SamplesListProps) {
        this.props.getSamples().then((samples) => {
            this.availableSamples = samples;
            this.setState({
                samples,
            });
        });
    }

    public focusOnSearchInput() {
        if (this.searchInput) {
            this.searchInput.focus();
        }
    }

    public getColumnContents() {

        const columns: BallerinaExampleCategory[][] = [];
        const { samples } = this.state;
        if (samples) {
            let sum = 0;
            samples.forEach((sample) => sum += sample.samples.length);
            let count: number = 0;
            let index: number = 0;
            samples.forEach((sample: BallerinaExampleCategory) => {
                columns[index] = columns[index] || [];
                columns[index].push(sample);
                count += sample.samples.length;
                if (count > sum / 4) {
                    count = 0;
                    index++;
                }
            });
        }
        return columns;
    }

    public renderColumnItem(column: BallerinaExampleCategory) {
        return (
            <List verticalAlign="middle" divided relaxed key={column.title} className="examples-block">
                <List.Item>
                    <List.Header>{column.title}</List.Header>
                    <List animated verticalAlign="middle">
                        {
                            column.samples.map((sample) => {
                                return (
                                    <List.Item className="example" key={sample.url}>
                                        <a
                                            href="#"
                                            onClick={
                                                () => this.props.openSample(sample.url)}
                                        >
                                            {sample.name}
                                        </a>
                                    </List.Item>);
                            })
                        }
                    </List>
                </List.Item>
            </List>
        );
    }

    public render() {
        return (
            <Grid className="welcome-page" divided>
                <Grid.Row className="welcome-navbar" columns={1}>
                    <Grid.Column>
                        <Header as="h3" dividing>
                            Ballerina Examples
                        </Header>
                        {this.state && this.state.noSearchReults ?
                            (<>No search results found!</>) : null
                        }
                        {this.state && this.state.samples && this.state.samples.length > 0 ?
                            (
                                <Form>
                                    <Form.Field inline>
                                        <Input
                                            ref={(ref) => {
                                                this.searchInput = ref as Input;
                                            }}
                                            loading={!this.state || !this.state.samples}
                                            placeholder="Search"
                                            onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
                                                this.setState({
                                                    searchQuery: event.currentTarget.value,
                                                });
                                                this.onSearchQueryEdit();
                                            }}
                                            className="search-control"
                                        />
                                    </Form.Field>
                                </Form>
                            ) : (
                                <>No Samples found in [BALLERINA_HOME]/examples folder.</>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="welcome-content-wrapper">
                    <Grid.Column mobile={16} tablet={16} computer={16} className="rightContainer">
                        <Grid>
                            {this.state && this.state.samples &&
                                <Grid.Row columns={4} className="sample-wrapper">
                                    {
                                        this.getColumnContents().map((column, index) => {
                                            return (
                                                <Grid.Column key={index} mobile={16} tablet={8} computer={4}>
                                                    {column.map((columnItem) => this.renderColumnItem(columnItem))}
                                                </Grid.Column>
                                            );
                                        })
                                    }
                                </Grid.Row>
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}
