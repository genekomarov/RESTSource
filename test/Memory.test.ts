import {Memory, Query, TIdentifier} from '../index';

interface IRecord {
    id: TIdentifier;
    title: string;
    description: string;
}

function generateData(count: number, keyType: 'string' | 'number'): IRecord[] {
    const data: IRecord[] = [];

    for (let index = 0; index < count; index++) {
        
        let id;
        switch (keyType) {
            case 'string':
                id = `id ${index}`;
                break;
            case 'number':
                id = index;
                break;
        }

        data.push({
            id,
            title: `title${index}`,
            description: `description${index}`
        });
    }
    return data;
} 

describe('Memory', () => {
    let initData: IRecord[];
        let memory: Memory<IRecord>;
        beforeEach(() => {
            initData = generateData(2, 'number');
            memory = new Memory<IRecord>({
                data: initData,
                keyProperty: 'id'
            });
        });
        test('Without query. The full list should be returned', () => {
            return memory.list()
                .then((result) => {
                    const {data, errors} = result;
                    expect(data).toBeTruthy();
                    expect(errors.length).toBeFalsy();
                    if (data) {
                        data.forEach((record, index) => {
                            expect(record).toEqual(initData[index]);
                        });
                    }
                });
        });
        test('With query. The error should be returned', () => {
            const query = new Query();
            return memory.list(query)
                .then((result) => {
                    const {data, errors} = result;
                    expect(data).toBeTruthy();
                    expect(errors.length).toBeTruthy();
                    expect(data).toBeTruthy();
                    if (data) {
                        data.forEach((record, index) => {
                            expect(record).toEqual(initData[index]);
                        });
                    }
                });
        });
        test('Reading an existing record. The record is returned', () => {
            return Promise.all(initData.map((record, index) => {
                const query = new Query();
                query
                    .setIdentifier(record.id);
                return memory.read(query)
                    .then((result) => {
                        const {data, errors} = result;
                        expect(data).toBeTruthy();
                        expect(data).toEqual(initData[index]);
                        expect(errors.length).toBeFalsy();
                    });
            }));
        });
        test('Reading an non-existing record. The error is returned', () => {
            const query = new Query();
            query
                .setIdentifier(1000);
            return memory.read(query)
                .then((result) => {
                    const {data, errors} = result;
                    expect(data).toBeNull();
                    expect(errors.length).toBeTruthy();
                });
        });
});
