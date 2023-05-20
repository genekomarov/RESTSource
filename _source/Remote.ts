import AbstractSource from "./AbstractSource";
import {
    ICreateResponce,
    IDeleteResponce,
    IListResponse,
    IReadResponse,
    IUpdateResponce
} from './interface/ICRUD'
import Query from "./Query";

export default class Remote<Data> extends AbstractSource<Data> {
    read(query: Query): Promise<IReadResponse<Data>> {
        throw(new Error('Метод не реализован'));
    }

    list(query?: Query): Promise<IListResponse<Data>> {
        throw(new Error('Метод не реализован'));
    }

    create(query: Query): Promise<ICreateResponce<Data>> {
        throw(new Error('Метод не реализован'));
    }

    update(query: Query): Promise<IUpdateResponce<Data>> {
        throw(new Error('Метод не реализован'));
    }
    
    delete(query: Query): Promise<IDeleteResponce> {
        throw(new Error('Метод не реализован'));
    }
}
