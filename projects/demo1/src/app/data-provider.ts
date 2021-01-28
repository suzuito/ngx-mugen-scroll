import {
    Cursor,
    CursorStoreInfo,
    DataProvider,
    OrderedDataStoreIdxServiceStore,
    OrderedDataStoreIdxService,
} from 'ngx-mugen-scroll';
import { Data } from './data';
import { randomIds } from './top/random-ids';

export class DataProviderImplAsc implements DataProvider<Data> {
    static store: OrderedDataStoreIdxServiceStore = {
        name: 'test-data',
        keyPath: ['id'],
        indices: [
            {
                name: 'idx1',
                keyPath: ['createdAt', 'name'],
                unique: true,
            }
        ],
    };
    constructor(
        private base: OrderedDataStoreIdxService,
    ) { }
    async fetchBottom(
        cursor: Cursor, n: number, includeEqual: boolean,
    ): Promise<Array<Data>> {
        return await this.base.getLargerN<Data>(
            DataProviderImplAsc.store.name,
            'idx1',
            cursor,
            n,
            includeEqual,
        );
    }
    async fetchTop(
        cursor: Cursor, n: number, includeEqual: boolean,
    ): Promise<Array<Data>> {
        return await this.base.getSmallerN<Data>(
            DataProviderImplAsc.store.name,
            'idx1',
            cursor,
            n,
            includeEqual,
        );
    }
    async fetchOnLoad(
        info: CursorStoreInfo,
    ): Promise<Array<Data>> {
        return await this.base.getLargerN<Data>(
            DataProviderImplAsc.store.name,
            'idx1',
            info.bottomCursor,
            info.n,
            true,
        );
    }
    async fetchOnInit(n: number): Promise<Array<Data>> {
        return await this.base.getLargerN<Data>(
            DataProviderImplAsc.store.name,
            'idx1',
            new Cursor([0, '']),
            n,
            true,
        );
    }

    async add(...v: Array<Data>): Promise<void> {
        this.base.add<Data>(DataProviderImplAsc.store.name, ...v);
    }
}

export async function generateTestDatas(
    base: OrderedDataStoreIdxService,
): Promise<void> {
    const store = new DataProviderImplAsc(base);
    const now = Date.now() / 1000;
    let i = 0;
    const randomDatas = randomIds.map(v => {
        i++;
        return { id: v, createdAt: now - (Math.random() * 1000), name: `データ ${i}`, };
    });
    await store.add(
        ...randomDatas,
    );
}
