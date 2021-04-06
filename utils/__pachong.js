const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');
const { pinyin } = require('pinyin-pro');
const { chunk } = require('lodash');
const { join } = path

const postsDirectory = join(process.cwd(), '_posts')


function getCateSlugs() {
    const list = fs.readdirSync(postsDirectory);
    return list.map(item => {
        return {
            cateSlug: pinyin(item, { toneType: 'none' }).replace(/ /g, ''),
            title: item
        }
    })
}
let cates = getCateSlugs();
// 4 6 14 15 16 20 23 31 32 33 35 37 38 39 40 41 50

async function main() {
    cates.map(async item => {
        let slugs = getCatePostSlugs(item.title);
        slugs = chunk(slugs, 1000);
        let ls = []
        await linkAsync(slugs, async (arr) => {
            await Promise.all(arr.map(async val => {
                const obj = await getPostBySlug(item.title, val);
                ls.push(obj)
            }))
        })
        fs.writeFile(`json/${item.title}.json`, JSON.stringify(ls), () => {

        })
    })
}

main();

// 获取某类目下的文件名
function getCatePostSlugs(cate) {
    const paths = fs.readdirSync(join(process.cwd(), `_posts/${cate}`));
    return paths.filter(item => item.indexOf('.md') > -1)
}

function getPostBySlug(cate, slug, fields = []) {
    return new Promise((res, rej) => {
        const realSlug = slug.replace(/\.md$/, '')
        const fullPath = join(postsDirectory, `${cate}/${realSlug}.md`)
        fs.readFile(fullPath, 'utf8', (err, fileContents) => {
            if (!err) {
                let arr = fileContents.match(/---(.|\n|\r)*---/);

                if (arr.length > 0) {
                    let str = arr[0]
                    const len = str.length;
                    str = str.replace(/(\n|\s|\r|:|\[|\]|")/g, '');
                    str = str.replace(/title/, 'title: ');
                    str = str.replace(/slug/, '\nslug: ');
                    str = str.replace(/description/, '\ndescription: ');
                    str = str.replace(/---/g, '\n---\n');
                    fileContents = str + fileContents.slice(len);
                    fileContents = fileContents.replace(/\n*/, '');
                }
                const { data, content } = matter(fileContents);

                const cateObj = cates.find(item => item.title === cate);

                const items = {
                    'cate-slug': cateObj.cateSlug || null,
                    'cate-title': cateObj.title || null,
                    content,
                    title: data.title || null,
                    description: data.description || null
                }
                res(items)
            } else {
                console.log(err)
            }

        })


    })

}


async function getPosts(cate, fields = []) {
    console.log(cate, 'cate')
    const slugs = getCatePostSlugs(cate)
    const arr = chunk(slugs, 1000);
    const data = []
    await linkAsync(arr, async (current) => {
        await Promise.all(current.map(async val => {
            const ls = await getPostBySlug(cate, val, fields)
            console.log(ls, 'ls')
            data.push(ls)
        }))

    })
    return data.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}


function getAllPosts(fields = []) {
    const cates = getCateSlugs();
    return cates.map(async item => {
        return getPosts(item.title, fields)
    })
}


async function linkAsync(arr, cb) {
    try {
        const len = arr.length;
        let index = 0;
        const hand = async (ls) => {
            await cb(ls[index]);
            if (index < len - 1) {
                index++;
                await hand(ls)
            }
        }
        await hand(arr)
    } catch (error) {

    }

}
