import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("proxy_api_log")
export class ProxyApiLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    proxyName: string;

    @Column()
    api: string;

    @Column()
    responseStatusCode: number;

    @Column({ nullable: true })
    message: string;

    @CreateDateColumn()
    logCreationTime: Date;
}
