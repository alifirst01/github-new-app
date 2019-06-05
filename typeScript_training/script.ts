class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

class Furniture{
    name: string;
    specification: string;
    wooden: boolean;

    constructor(n: string, s: string, w: boolean, private price: number = 10) {
        this.name = n;
        this.specification = s;
        this.wooden = true;
        this.price = 120;
    }

    getPrice(){
        return this.price;
    }

    static p: Furniture = new Furniture("a", "b", false, 1);
}

let f1 = new Furniture("bed", "plastic", true);
Furniture.p = new Furniture("c", "d", true);

let isDone: boolean = true;
let myNum: number = 5;

let isNumber = (x: any): boolean => {
    if (typeof x === 'number')
        return true;
    else
        return false;
}

interface Fruit{
    name: string;
    color: string;
    quantity?: number;

    price(): number;
}

class MangoFruit implements Fruit{
    name: string;
    color: string;
    price() {
        return 10;
    }
    constructor() {
        this.name = "mango";
    }
}

class GreenMangoFruit extends MangoFruit{
    constructor(newName: string) {
        super();
        this.name = newName;
    }
}

let gmf = new GreenMangoFruit('newMango');

let f: Fruit = {
    name: "Mango",
    color: "Yellow",
    price: () => {
        return 1;
    } 
}

let greeter = new Greeter("world");

module FurnitureModule{
    class Bed{
        name: string;
    }
    class Chair{
        name: string;
        value: number;
    }

    export class { Bed };
}

let G = new FurnitureModule.Bed;

let button = document.createElement('button');
button.textContent = "Say Hello";
button.onclick = function() {
    alert(gmf.name);
}

document.body.appendChild(button);