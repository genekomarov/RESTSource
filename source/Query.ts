import {
    IQuery,
    INavigation,
    ISort,
    IFilter,
    IPayload,
    TIdentifier
} from './interface/ICRUD';

/*** Запрос */
export default class Query implements IQuery {

    /*** Навигация */
    private _navigation : INavigation | undefined;
    /*** Сортировка */
    private _sort       : ISort | undefined;
    /*** Фильтр */
    private _filter     : IFilter | undefined;
    /*** Идентификатор */
    private _identifier : TIdentifier | undefined;
    /*** Полезные данные */
    private _payload    : IPayload | undefined;

    getNavigation(): INavigation | undefined {
        return this._navigation;
    }

    setNavigation(data: INavigation): IQuery {
        this._navigation = data;
        return this;
    }

    getSort(): ISort | undefined {
        return this._sort;
    }

    setSort(data: ISort): IQuery {
        this._sort = data;
        return this;
    }

    getFilter(): IFilter | undefined {
        return this._filter;
    }

    setFilter(data: IFilter): IQuery {
        this._filter = data;
        return this;
    }

    getIdentifier(): TIdentifier | undefined {
        return this._identifier;
    };

    setIdentifier(data: TIdentifier): IQuery {
        this._identifier = data;
        return this;
    }

    getPayload(): IPayload | undefined {
        return this._payload;
    }

    setPayload(data: IPayload): IQuery {
        this._payload = data;
        return this;
    }

    /*** Получить строку GET параметров */
    getQueryString(): string | null {
        throw(new Error('Метод getQueryString не реализован'));
    }
}
