import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("stock_data")
export class StockData {
    @Column()
    uid: string;

    @PrimaryColumn()
    symbol: string;

    @PrimaryColumn()
    interval: number;

    @PrimaryColumn()
    timestamp: Date;

    @Column({ type: "float" })
    open: number;

    @Column({ type: "float" })
    close: number;

    @Column({ type: "float" })
    high: number;

    @Column({ type: "float" })
    low: number;

    @Column()
    volume: number;

    @Column()
    source: string;

    @Column()
    valid: boolean;

    @CreateDateColumn()
    createdTime: Date;

    @UpdateDateColumn()
    updatedTime: Date;

    constructor(
        symbol: string,
        interval: number,
        timestamp: Date,
        open: number,
        close: number,
        high: number,
        low: number,
        volume: number,
        source: string,
        valid = false
    ) {
        this.uid = symbol + "_" + interval + "min_" + timestamp;
        this.symbol = symbol;
        this.interval = interval;
        this.timestamp = timestamp;
        this.open = open;
        this.close = close;
        this.high = high;
        this.low = low;
        this.volume = volume;
        this.source = source;
        this.valid = valid;
    }
}
