import {
    ICRUD,
    IQuery,
    TIdentifier,
    IResponceBase,
    TListResponce,
    TCreateResponce,
    TReadResponce,
    TUpdateResponce,
    TDeleteResponce
} from "./interface/ICRUD";

/*** Параметры для инициализации источника */
export interface ISourceParams<Record> {
    /*** Поле в котором лежит ключ записи */
    keyProperty: keyof Record;
}

/*** Абстрактный источник данных */
export default abstract class AbstractSource<Record, Identifier extends TIdentifier>
implements ICRUD<Record> {

    /*** Имя ключевого поля */
    protected readonly _keyProperty: keyof Record;

    constructor(params: ISourceParams<Record>) {
        const {keyProperty} = params;
        this._keyProperty = keyProperty;
    }

    abstract list(query?: IQuery)    : Promise<TListResponce<Record>>
    abstract create(query: IQuery)  : Promise<TCreateResponce<Identifier>>
    abstract read(query: IQuery)    : Promise<TReadResponce<Record>>
    abstract update(query: IQuery)  : Promise<TUpdateResponce<Record>>
    abstract delete(query: IQuery)  : Promise<TDeleteResponce>
    
    call(query: IQuery)             : Promise<IResponceBase<object>> {
        throw(new Error('Метод call не реализован'))
    }
}
