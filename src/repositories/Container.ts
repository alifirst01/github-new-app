import {Container, createDecorator} from "@owja/ioc";
import {TYPE} from "@/utils/types";
import axios from "axios"
import { AxiosInstance } from "axios"


const container = new Container();
const inject = createDecorator(container);

// Binding AxiosInstance class dependency
container.bind<AxiosInstance>(TYPE.AxiosInstance).toFactory(() => 
    axios.create({})
);

export {container, TYPE, inject};