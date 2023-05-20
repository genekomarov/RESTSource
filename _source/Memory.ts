import Query from "./Query";
import {TIdentifier } from "./interface/IIdentifier";
import {
    ICreateResponce,
    IDeleteResponce,
    IListResponse,
    IReadResponse,
    IUpdateResponce
} from './interface/ICRUD';
import AbstractSource from "./AbstractSource";

const DEFAULT_RESERVED_ID: number = 1000;

interface IMemoryParams<Data> {
    data: Data[];
    idProperty: keyof Data;
    reservedId?: number;
}

export default class Memory<Data> extends AbstractSource<Data> {
    
    private _data: Data[];
    private readonly _idProperty: keyof Data;
    private _reservedId: number = DEFAULT_RESERVED_ID;

    constructor(params: IMemoryParams<Data>) {
        super();

        const {data, idProperty, reservedId} = params;
        if (reservedId) {
            this._reservedId = reservedId;
        }
        const dataLength = data.length;
        if (dataLength > this._reservedId) {
            throw(new Error('размер данных не должен превышать зарезервированный'
            + ` data.lendth: ${dataLength}, reservedId: ${this._reservedId}`));
        }
        this._data = data;
        this._idProperty = idProperty;
    }

    read(query: Query): Promise<IReadResponse<Data>> {
        const id = query.getId();
        if (id === null) {
            return Promise.reject('Не задан идентификатор в запросе');
        }
        const data = this._findData(id);
        if (data === null) {
            return Promise.reject(`Данные с таким идентификатором не найдены. id: ${id}`);
        }
        return Promise.resolve({
            data,
            meta: {}
        });
    }

    list(query?: Query): Promise<IListResponse<Data>> {
        return Promise.resolve({
            data: this._data,
            meta: {}
        });
    }

    create(query: Query): Promise<ICreateResponce<Data>> {
        const payload = query.getPayload();
        if (payload === null) {
            return Promise.reject('Не переданы данные в запросе');
        }
        const id = this._generateId();
        const addedData = {...payload, [this._idProperty]: id} as Data;
        this._data.push(addedData);
        return Promise.resolve({
            data: addedData,
            meta: {}
        });
    }

    update(query: Query): Promise<IUpdateResponce<Data>> {
        const payload = query.getPayload();
        if (payload === null) {
            return Promise.reject('Не переданы данные в запросе');
        }
        return this.read(query)
            .then((res) => {
                const data = res.data as Data;
                const updatedData = {...payload, [this._idProperty]: data[this._idProperty]} as Data;
                const dataIndex: number = this._data.findIndex((dataElement) => {
                    return dataElement == res.data;
                });
                this._data[dataIndex] = updatedData;
                return {
                    data: updatedData,
                    meta: {}
                }
            });
    }
    
    delete(query: Query): Promise<IDeleteResponce> {
        return this.read(query)
            .then((res) => {
                const data = res.data as Data;
                const id = query.getId() as TIdentifier;
                this._data = this._data.filter((dataElement) => {
                    return dataElement[this._idProperty] !== id;
                });
                return {
                    data: data[this._idProperty] as TIdentifier,
                    meta: {}
                }
            })
    }

    private _findData(id: TIdentifier): Data | null {
        const data = this._data.find((dataElement) => {
            return dataElement[this._idProperty] === id;
        });
        return data || null;
    }

    private _generateId(): TIdentifier {    
        return typeof this._idProperty === 'string'
            ? `memory id ${this._reservedId ++}`
            : this._reservedId ++;
    }
}
