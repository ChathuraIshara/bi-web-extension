/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// Union type field, the type is resolved via the value expr
function tnfUnionField1(Vehicle car) returns Car => {
    vehicle: {
        model: car.category,
        year: car.year
    }
};

// Type casted union type field
function tnfUnionField2(Vehicle car) returns Car => {
    vehicle: <SUV>{
        model: car.category,
        year: car.model.engine.length()
    }
};

// Union type field which is missing the value
function tnfUnionField3(Vehicle car) returns Car => {
    vehicle:

};

// Normal field
function tnfUnionField4(Vehicle car) returns CarA => {
    vehicle: {
        model: car.category,
        year: car.year
    }

};

// Value assigned via link
function tnfUnionField5(Vehicle vehicle) returns NewVehicle => {
    model: <string>vehicle.category

};

// Union type consist with error
function tnfUnionField6(Vehicle car) returns CarB => {
    vehicle: {}
};

// Union type field containing arrays
function tnfUnionField7(Vehicle car) returns CarC => {
    vehicle: <HighEndCar[]>[
        {
            model: car.model
        },
        {
            model: {
                engine: car.category + car.model.engine
            }
        }
    ]

};

// Union type field within query expression
function tnfUnionField8(VehicleA car) returns CarArr => {
};

// Union type inside a union type field
function tnfUnionField9(Vehicle car) returns CarInner => {
    vehicle: <ModelA>{
        vehicleA: <HighEndCar>{
            model: car.model,
            year: car.year
        }
    }

};

// Union type field inside a root union type
function tnfUnionField10(Vehicle car) returns Car|CarA => {

};

// Array of union type field
function tnfUnionField11(Vehicle car) returns CarD => {
    vehicle: [
        <HighEndCar>{}
    ]

};
