import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { censorAPI } from "../../util/censor.url";

const API_KEY_FIELDS: string[] = ["apikey", "access_key"];

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
        this.api = api != null ? censorAPI(api, API_KEY_FIELDS) : null;
        this.responseStatusCode = responseStatusCode;
        this.message = message;
    }
}
