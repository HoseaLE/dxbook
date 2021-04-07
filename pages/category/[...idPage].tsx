import request from "@utils/request";
import Layout from "@components/layout";
import ListItem from "@components/listItem";
import Link from "next/link";
import styles from "./id.less";
import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import Pagination from "@components/pagination";
import { useCallback } from "react";
import config from "@config/config";

const { siteName } = config;

interface Props {
    data: null | { [key: string]: any };
    total: number;
    page: number;
}

export default function Home({ data, total, page }: Props) {
    const router = useRouter();
    if (!data && typeof window === "object") {
        router.push("/404");
    }

    const createPath = useCallback((page) => {
        return {
            pathname: `/category/${data[0]["cate-slug"]}/${page}`,
        };
    }, []);

    const seo = {
        title: `${data[0]["cate-title"]} -- ${siteName}`,
    };

    return (
        <Layout seo={seo}>
            {data && data.length > 0 && (
                <div className={styles.container}>
                    <div className={styles.head}>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link href={`/`}>
                                    <a>首页</a>
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {data[0]["cate-title"]}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className={styles.main}>
                        {data.map((item) => {
                            return (
                                <ListItem
                                    style={{ marginBottom: 20 }}
                                    title={
                                        <Link href={`/book/${item._id}`}>
                                            <a>{item.title}</a>
                                        </Link>
                                    }
                                    description={item.description}
                                />
                            );
                        })}

                        <Pagination
                            current={page}
                            total={total}
                            createPath={createPath}
                        />
                    </div>
                </div>
            )}
            <br />
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { idPage } = params;
    const id = idPage[0];
    const page = idPage[1] || 1;
    const { data, status } = await request({
        url: "/api/getBooks",
        data: {
            id,
            page,
        },
    });
    if (status === 0) {
        const list = data.list || [];
        return {
            props: {
                data: list,
                page: page,
                total: data.total,
            },
        };
    }
    return {
        props: {
            data: null,
            total: 0,
            page: 1,
        },
    };
}
