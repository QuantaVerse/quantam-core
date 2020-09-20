import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("StockData")
export class StockData {
    @PrimaryColumn()
    id: string;

    @Column()
    symbol: string;

    @Column()
    interval: number;

    @Column()
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

    constructor(
        symbol: string,
        interval: number,
        timestamp: Date,
        open: number,
        close: number,
        high: number,
        low: number,
        volume: number
    ) {
        this.id = symbol + "_" + interval + "min_" + timestamp;
        this.symbol = symbol;
        this.interval = interval;
        this.timestamp = timestamp;
        this.open = open;
        this.close = close;
        this.high = high;
        this.low = low;
        this.volume = volume;
    }
}
