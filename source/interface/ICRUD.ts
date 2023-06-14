/*** Идентификатор записи */
type TIdentifier = string | number | null;

/*** Объект онибки выполнения запроса */
interface IError {
    message: string;
    description: string;
    reason: string;
}

/*** Базовый интерфейс ответа */
interface IResponceBase<Data> {
    /*** Данные */
    data: Data | null;
    /*** Мета информация */
    meta: object;
    /*** Ошибки выполненя запроса */
    errors: IError[];
}

/*** Результат списозчного запроса */
type TListResponce<Record>         = IResponceBase<Record[]>;
/*** Результат создания записи */
type TCreateResponce<Identifier>   = IResponceBase<Identifier>;
/*** Результат чтения записи */
type TReadResponce<Record>         = IResponceBase<Record>;
/*** Результат обновления записи */
type TUpdateResponce<Record>       = IResponceBase<Record>;
/*** Результат удаления записи */
type TDeleteResponce  = IResponceBase<null>;

/*** Интерфейс объекта, который поддерживает CRUD операции */
export default interface ICRUD<Record> {
    /*** Чтение списка записей */
    list(query?: IQuery)      : Promise<TListResponce<Record>>;
    /*** Создание записи */
    create(query: IQuery)    : Promise<TCreateResponce<TIdentifier>>;
    /*** Чтение записи */
    read(query: IQuery)      : Promise<TReadResponce<Record>>;
    /*** Обновление записи */
    update(query: IQuery)    : Promise<TUpdateResponce<Record>>;
    /*** Удаление записи */
    delete(query: IQuery)    : Promise<TDeleteResponce>;
    /*** Вызов произвольного запроса */
    call(query: IQuery)      : Promise<IResponceBase<object>>;
}

/*** Тип данных для передачи */
type TPayload       = string | number | boolean | object;

/*** Значение для поиска */
type TFilterValue   = string | number | boolean;

/*** Направление сортировки */
type TSort          = 'asc' | 'desc';

/*** Объект фильтрации */
interface IFilterObject {
    lte:    TFilterValue;
    gte:    TFilterValue;
    equal:  TFilterValue;
    exist:  TFilterValue;
    [filterType: string]: TFilterValue;
}

/*** Навигация */
interface INavigation {
    limit:  number;
    offset: number;
}

/*** Сортировка */
interface ISort {
    [field: string]: TSort;
}

/*** Фильтрация */
interface IFilter {
    [field: string]: IFilterObject
}

/*** Данные для передачи */
interface IPayload {
    payload: TPayload;
}

/*** Интерфейс объекта запроса */
interface IQuery {
    /*** Получить навигацию */
    getNavigation   : ()                    => INavigation | undefined;
    /*** Установить навигацию */
    setNavigation   : (data: INavigation)   => IQuery;

    /*** Получить сортировку */
    getSort         : ()                    => ISort | undefined;
    /*** Установить навигацию */
    setSort         : (data: ISort)         => IQuery;

    /*** Получить фильтрацию */
    getFilter       : ()                    => IFilter | undefined;
    /*** Установить навигацию */
    setFilter       : (data: IFilter)       => IQuery;

    /*** Получить идентификатор */
    getIdentifier   : ()                    => TIdentifier | undefined;
    /*** Установить идентификатор */
    setIdentifier   : (data: TIdentifier)   => IQuery;

    /*** Получить данные */
    getPayload      : ()                    => IPayload | undefined;
    /*** Установить навигацию */
    setPayload      : (data: IPayload)      => IQuery;
}

export {
    ICRUD,
    IQuery,

    TIdentifier,

    TListResponce,
    TCreateResponce,
    TReadResponce,
    TUpdateResponce,
    TDeleteResponce,
    IResponceBase,

    INavigation,
    IFilter,
    ISort,
    IPayload,

    IError
};
