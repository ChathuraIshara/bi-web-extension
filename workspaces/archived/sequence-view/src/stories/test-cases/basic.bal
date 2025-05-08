import ballerina/http;
import ballerina/io;

public function main(string... args) returns error? {
    http:Client sample = check new ("http://sample.io");
    string response = check sample->/sample/code();
    io:print(response);
}
