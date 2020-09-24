import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { IntervalEnum } from "../../common/interfaces/data.interface";

@Entity("proxy_job_log")
export class ProxyJobLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    symbol: string;

    @Column()
    exchange: string;

    @Column()
    interval: IntervalEnum;

    @Column()
    fromDate: Date;

    @Column()
    toDate: Date;

    @Column({ nullable: true })
    proxy: string;

    @Column({ nullable: true })
    proxyUsed: string;

    @Column({ nullable: true })
    api: string;

    @Column({ nullable: true })
    responseStatusCode: number;

    @Column({ nullable: true })
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(
        symbol: string,
        exchange: string,
        interval: IntervalEnum,
        fromDate: Date,
        toDate: Date,
        proxy: string,
        proxyUsed: string = null,
        api: string = null,
        responseStatusCode: number = null,
        message: string = null
    ) {
        this.symbol = symbol;
        this.exchange = exchange;
        this.interval = interval;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.proxy = proxy;
        this.proxyUsed = proxyUsed;
        this.api = api;
        this.responseStatusCode = responseStatusCode;
        this.message = message;
    }
}
