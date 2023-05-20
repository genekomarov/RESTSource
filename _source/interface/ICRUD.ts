import {TIdentifier} from './IIdentifier';
import Query from '../Query';

export interface IListResponse<Data> {
    data: Data[] | undefined;
    meta: object;
}

export interface IReadResponse<Data> {
    data: Data | undefined;
    meta: object;
}

export interface IDeleteResponce {
    data: TIdentifier;
    meta: object;
}

export interface ICreateResponce<Data> {
    data: Data;
    meta: object;
}

export interface IUpdateResponce<Data> {
    data: Data;
    meta: object;
}

export default interface ICRUD<Data> {
    read(query: Query): Promise<IReadResponse<Data>>;
    list(query: Query): Promise<IListResponse<Data>>;
    create(query: Query): Promise<ICreateResponce<Data>>;
    update(query: Query): Promise<IUpdateResponce<Data>>;
    delete(query: Query): Promise<IDeleteResponce>;
    call(query: Query): Promise<any>;
}
