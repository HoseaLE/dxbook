import React from "react";
import { Pagination } from "antd";
import Link from "next/link";
import { useCallback } from "react";

interface Props {
    total: number;
    current: number;
    createPath: (
        page: number
    ) => { pathname: string; query?: { [key: string]: any } };
}

export default ({ total, current, createPath }: Props) => {
    current = Number(current);
    console.log(current, "current");
    const itemRender = useCallback(
        (page, type, originalElement) => {
            if (type === "prev") {
                return (
                    <Link href={createPath(current - 1)}>
                        <a>上一页</a>
                    </Link>
                );
            }
            if (type === "next") {
                return (
                    <Link href={createPath(current + 1)}>
                        <a>下一页</a>
                    </Link>
                );
            }
            if (["jump-prev", "jump-next"].includes(type)) {
                return originalElement;
            }
            return (
                <Link href={createPath(page)}>
                    <a>{page}</a>
                </Link>
            );
        },
        [current]
    );

    return (
        <Pagination
            current={current}
            itemRender={itemRender}
            total={total}
            pageSize={10}
            showSizeChanger={false}
        />
    );
};
