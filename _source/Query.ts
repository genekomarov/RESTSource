import {TIdentifier} from './interface/IIdentifier';

interface IFilter {
    
}

interface INavigation {
    pageSize: number;
    page: number;
}

interface IQuery {
    filter?: IFilter;
    navigation?: INavigation;
    id?: TIdentifier;
    payload?: object;
    [field: string]: any;
}

export default class Query {
    private _query: IQuery = {};

    setFilter(filter: IFilter): Query {
        this._query.filter = filter;
        return this;
    };

    setNavigation(navigation: INavigation): Query {
        this._query.navigation = navigation;
        return this;
    };

    setIdentifier(id: TIdentifier): Query {
        this._query.id = id;
        return this;
    }

    setPayload(payload: object): Query {
        this._query.payload = payload;
        return this;
    }

    getFilter(): IFilter | null {
        return this._query.filter || null;
    }

    getNavigation(): INavigation | null {
        return this._query.navigation || null;
    }

    getId(): TIdentifier | null {
        if (this._query.id !== undefined) {
            return this._query.id;
        }
        return null;
    }

    getPayload(): object | null {
        if (this._query.payload !== undefined) {
            return this._query.payload;
        }
        return null;
    }

    getAllQuery(): IQuery {
        return this._query;
    }
};
