function chunk<T>(array: T[], size: number) {
  const chunked: T[][] = [];
  let index = 0;
  while (index < array.length) {
    chunked.push(array.slice(index, size + index));
    index += size;
  }
  return chunked;
}

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function getPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data as Post[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function createPosts(posts: Post[]) {
  const list = document.createElement('ul');
  list.classList.add('posts');

  for (const post of posts) {
    const li = document.createElement('li');
    li.classList.add('post');
    li.appendChild(createTextNode('h2', post.title));
    li.appendChild(createTextNode('p', post.body));
    list.appendChild(li);
  }

  return list;
}

function createTextNode(tagName: string, text: string) {
  const element = document.createElement(tagName);
  element.textContent = text;
  return element;
}

function* createPostIterator(chunkedPosts: Post[][]) {
  for (const posts of chunkedPosts) {
    yield createPosts(posts);
  }
}

async function main() {
  const container = document.querySelector('.container');
  const loadMore = document.querySelector('.load-more');
  if (!container || !loadMore) {
    return;
  }

  const posts = await getPosts();
  const chunkIterator = createPostIterator(chunk(posts, 10));

  loadMore.addEventListener('click', () => {
    const { value, done } = chunkIterator.next();
    if (!done) {
      container.appendChild(value);
      window.scrollTo(0, document.body.scrollHeight);
    }
  });
}

main();
