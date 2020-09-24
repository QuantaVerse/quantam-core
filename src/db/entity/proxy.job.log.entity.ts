import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { IntervalEnum } from "../../common/interfaces/data.interface";

@Entity("proxy_job_log")
export class ProxyJobLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    proxy: string;

    @Column()
    jobType: string;

    @Column({ nullable: true })
    api: string;

    @Column()
    responseStatusCode: number;

    @Column({ nullable: true })
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(proxy: string, jobType: string, api: string = null, responseStatusCode = 0, message: string = null) {
        this.proxy = proxy;
        this.jobType = jobType;
        this.api = api;
        this.responseStatusCode = responseStatusCode;
        this.message = message;
    }
}
