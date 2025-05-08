/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
type Vehicle record {
    string category;
    Model model;
    decimal price;
    int year;
};

type Car record {
    SUV|HighEndCar vehicle;
};

type SUV record {|
    string model;
    int year;
|};

type HighEndCar record {
    Model model;
    int year;
};

type Model record {
    string transmission;
    string engine;
};

type NewVehicle record {
    Model|string model;
};

type CarA record {
    SUV vehicle;
};

type CarB record {
    SUV|error vehicle;
};

type CarC record {
    SUV[]|HighEndCar[] vehicle;
};

type CarD record {
    (SUV|HighEndCar)[] vehicle;
};

type VehicleA record {
    string category;
    Model[] model;
};

type CarArr record {
    string id;
    ModelA[] model;
};

type CarInner record {
    string|ModelA vehicle;
};

type ModelA record {
    SUV|HighEndCar vehicleA;
};

type T1 record {
    string str;
};

type T11 record {
    string str;
    record {
        string name;
        int age;
        record {
            string parentName;
            int parentAge;
        } parent;
    } person;
};

type T2 record {
    boolean foo;
};

type T3 record {
    T1[] t1s;
};

type T4 record {
    T1[]|T2[] t1sOrT2s;
};

type T5 record {
    (T1|T2)[] t1OrT2s;
};

type T51 record {
    (T11|T2)[] t11sOrT2s;
};

type TypeAll TypeA|TypeB;

type TypeA record {
    string strA;
    TypeB1 tb1;
};

type TypeB TypeB1|TypeB2;

type TypeB1 record {
    string strB1;
};

type TypeB2 record {
    string strB2;
};

type TypeC record {
    string strC;
};
