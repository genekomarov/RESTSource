import AbstractSource, {ISourceParams} from "./AbstractSource";
import {
    TListResponce,
    TCreateResponce,
    TReadResponce,
    TUpdateResponce,
    TDeleteResponce,
    IError,
    TIdentifier,
    IQuery
} from './interface/ICRUD';

const DEFAULT_RESERVED_ID: number = 1000;

/*** Параметры для инициализации источника */
interface IMemoryParams<Record> extends ISourceParams<Record> {
    /*** Данные */
    data: Record[];
    /**
     * Зарезервированное количество записей, с которыми инициалиируется источник.
     * Используется для расчета ключевого поля для новых записей.
     */
    reservedId?: number;
}

/*** Ошибка выполнения запроса */
class QueryError implements IError {
    
    message: string = '';
    description: string = '';
    reason: string = '';
    
    constructor (params: Partial<IError>) {
        const {message, description, reason} = params;
        this.message        = message ?? '';
        this.description    = description ?? '';
        this.reason         = reason ?? '';
    }
}

/*** Локальный источник данных */
export default class Memory<Record, Identifier extends TIdentifier = TIdentifier>
extends AbstractSource<Record, Identifier> {
    
    /*** Данные */
    private _data: Record[];
    /*** Зарезервированное количество записей, с которыми инициализируется источник */
    private _reservedId: number = DEFAULT_RESERVED_ID;

    constructor(params: IMemoryParams<Record>) {
        super(params);

        const {data, reservedId} = params;
        if (reservedId) {
            this._reservedId = reservedId;
        }
        const dataLength = data.length;
        if (dataLength > this._reservedId) {
            throw(new Error('размер данных не должен превышать зарезервированный'
            + ` data.lendth: ${dataLength}, reservedId: ${this._reservedId}`));
        }
        this._data = data;
    }

    list(query?: IQuery): Promise<TListResponce<Record>> {
        const errors: IError[] = [];
        if (query) {
            errors.push(new QueryError({
                message: 'Метод list не поддерживает запросы на Memory',
                description: 'Возвращаем весь набор данных'
            }));
        }
        return Promise.resolve({
            data: this._data,
            meta: {},
            errors
        });
    }

    create(query: IQuery): Promise<TCreateResponce<Identifier>> {
        const payload = query.getPayload()?.payload as Record;
        if (!payload) {
            return Promise.reject('Не переданы данные в запросе');
        }
        const id = this._generateId();
        const addedData = {...payload, [this._keyProperty]: id} as Record;
        this._data.push(addedData);
        const identifier = addedData[this._keyProperty] as Identifier;
        return Promise.resolve({
            data: identifier,
            meta: {},
            errors: []
        });
    }

    read(query: IQuery): Promise<TReadResponce<Record>> {
        const id = query.getIdentifier();
        if (id === undefined) {
            return Promise.reject('Не задан идентификатор в запросе');
        }
        let data: Record | null;
        const errors: IError[] = [];
        const record = this._findRecord(id);
        if (record === null) {
            data = null;
            errors.push(new QueryError({
                message: `Данные с указанным идентификатором не найдены id: ${id}`
            }));
        } else {
            data = record;
        }
        return Promise.resolve({
            data,
            meta: {},
            errors
        });
    }

    update(query: IQuery): Promise<TUpdateResponce<Record>> {
        const payload = query.getPayload()?.payload as Record;
        if (!payload) {
            return Promise.reject('Не переданы данные в запросе');
        }
        return this.read(query)
            .then((result) => {
                const record = result.data;
                if (!record) {
                    return result;
                }
                const updatedData = {...payload, [this._keyProperty]: record[this._keyProperty]};
                
                const dataIndex: number = this._data.findIndex((dataElement) => {
                    return dataElement == result.data;
                });
                this._data[dataIndex] = updatedData;
                return {
                    data: updatedData,
                    meta: {},
                    errors: []
                }
            });
    }
    
    delete(query: IQuery): Promise<TDeleteResponce> {
        return this.read(query)
            .then((result) => {
                const record = result.data;
                if (!record) {
                    return result as TDeleteResponce;
                }
                const id = query.getIdentifier();
                this._data = this._data.filter((dataElement) => {
                    return dataElement[this._keyProperty] !== id;
                });
                return {
                    data: null,
                    meta: {},
                    errors: []
                    
                }
            })
    }

    private _findRecord(id: TIdentifier): Record | null {
        const record = this._data.find((dataElement) => {
            return dataElement[this._keyProperty] === id;
        });
        return record || null;
    }

    private _generateId(): TIdentifier {    
        return typeof this._keyProperty === 'string'
            ? `memory id ${this._reservedId ++}`
            : this._reservedId ++;
    }
}
