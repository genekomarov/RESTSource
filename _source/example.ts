import Memory from "./Memory";
import Query from "./Query";

interface IDataElement {
    id: number;
    title: string;
    description: string;
}

const memory = new Memory<IDataElement>({
    data: [{
        id: 0,
        title: 'title0',
        description: 'description1'
    },{
        id: 1,
        title: 'title1',
        description: 'description2'
    }],
    idProperty: 'id'
});

memory.list()
    .then((res) => {
        console.log(res);
    });

memory.read(new Query().setIdentifier(0))
    .then((res) => {
        console.log(res);
    });

memory.delete(new Query().setIdentifier(0))
    .then((res) => {
        console.log(res);
        memory.list()
            .then((res) => {
                console.log(res);
            });
    });

memory.create(new Query().setPayload({
    id: 2,
    title: 'title2',
    description: 'description2'
}))
    .then((res) => {
        console.log(res);
        memory.list()
            .then((res) => {
                console.log(res);
            });
    })
    