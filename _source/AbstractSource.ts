import ICRUD, {
    ICreateResponce,
    IDeleteResponce,
    IListResponse,
    IReadResponse,
    IUpdateResponce
} from "./interface/ICRUD";
import Query from './Query'

export default abstract class AbstractSource<Data> implements ICRUD<Data> {
    abstract read(query: Query): Promise<IReadResponse<Data>>
    abstract list(query: Query): Promise<IListResponse<Data>>
    abstract create(query: Query): Promise<ICreateResponce<Data>>
    abstract update(query: Query): Promise<IUpdateResponce<Data>>
    abstract delete(query: Query): Promise<IDeleteResponce>
    
    call(query: Query): Promise<any> {
        throw(new Error('Метод call не реализован'))
    }
}