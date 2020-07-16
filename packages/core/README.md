# Dgraphium Core (QueryBuilder)

Query builder for Dgraph database.

## Demo

```typescript
import { query, edge } from '@dgraphium/core';
import { uid, regex, gt, gte, lt, and, or } from '@dgraphium/core/operators';
const meQuery = query()
  .name('me')
  .func(uid('0x2', '0x3', '0x4'))
  .filter(and(
    or(
      regex('name', /zura/i),
      regex('name', /benashvili/i),
    ),
    gte('age', 15),
    lt('age', 25)
  ))
  .project({
    id: 1, // uid = id
    name: 1,
    age: 1,
    posts: edge({
        id: 1,
        text: 1,
      })
      .filter(gt('createdDate', new Date('2020-01-01')))
      .first(10),
  })
  .first(1)
  .build();
```

`meQuery.toString()` outputs (built query string):
```graphql
{
  me(func: uid(0x2, 0x3, 0x4), first: 1) @filter((regexp(name, /zura/i) OR regexp(name, /benashvili/i)) AND ge(age, 15) AND lt(age, 25)) {
    id: uid
    name: name
    age: age
    posts: posts (first: 10) @filter(gt(createdDate, 2020-01-01T00:00:00.000Z)) {
      id: uid
      text: text
    }
  }
}
```

run query with [@dgraphium/client](../client):
```typescript
await dgraphClient.newTxn().query(meQuery);
```

### use GraphQL Variables(params) in query

```typescript
import { query, edge, params } from '@dgraphium/core';
import { uid, regex, gt, gte, lt, and, or } from '@dgraphium/core/operators';

const meQuery = query()
  .name('me')
  .func(uid(params.uids('0x2', '0x3', '0x4')))
  .filter(and(
    or(
      regex('name', params.regex(/zura/i)),
      regex('name', params.regex(/benashvili/i)),
    ),
    gte('age', params.int(15)),
    lt('age', params.int(25))
  ))
  .project({
    id: 1, // uid = id
    name: 1,
    age: 1,
    posts: edge({
        id: 1,
        text: 1,
      })
      .filter(gt(
        'createdDate',
        params.date(new Date('2020-01-01'))
      ))
      .first(10),
  })
  .first(1)
  .build();
```
`meQuery.toString()` outputs (built query string):
```graphql
query q($p2: string, $p1: string, $p3: string, $p4: string, $p5: int, $p6: int) {
  me(func: uid($p1), first: 1) @filter((regexp(name, $p3) OR regexp(name, $p4)) AND ge(age, $p5) AND lt(age, $p6)) {
    id: uid
    name: name
    age: age
    posts: posts (first: 10) @filter(gt(createdDate, $p2)) {
      id: uid
      text: text
    }
  }
}
```
run query with [@dgraphium/client](../client):
```typescript
await dgraphClient.newTxn().query(meQuery); // params will be included
```

> **Note:** you can name parameters by: `params.[paramType](...).name(paramName)`.
> For example: `params.string('strValue').name('myParamName')`. 
> This is useful when you want to reuse query and override parameters:
>
> for example: 
> ```typescript
> await dgraphClient.newTxn().queryWithVars(
>   queryWithParam,
>   { '$myParam': 'newStringValue' } 
> );
> ```

### GraphQL types
if you have [GraphQL schema](https://graphql.dgraph.io/schema),
when you deploy that schema to Dgraph database, each field gets prefixed
by it's type.

for example:

```graphql
type User {
    id: ID!
    name: String!
    age: Int!
    posts: [Post]
}

type Post {
  id: ID!
  text: String!
  replyCount: Int
}
```

results in following Dgraph schema:

```graphql
type User {
  User.name
  User.age
  User.posts
}

type Post {
  Post.text
  Post.replyCount
}

User.name: string
User.age: int
User.posts: [uid]
```

so to query such data, you need to prefix each field with it's type:
```graphql
{
  me(func: uid(0x2)) {
    id: uid
    name: User.name
    age: User.age
    posts: User.posts @filter(gt(Post.replyCount, 2)) {
      id: uid
      text: Post.text
      replyCount: Post.replyCount
    }
  }
}
```

to achieve exactly above written query with **Dgraphium**:
```typescript
query('user') // <- type User
  .name('me')
  .func(uid('0x2'))
  .project({
    id: 1,
    name: 1,
    age: 1,
    posts: edge('post', { // <- type Post
        id: 1,
        text: 1,
        replyCount: 1,
      })
      .filter(gt('replyCount', 2)),
  })
```

### Combine queries

you can combine queries with:
```typescript
import { combine } from '@dgraphium/core';

const combinedQuery = combine(
  query1,
  query2,
  ...
);
```

**Note**:
  - don't call `build` method on query before passing to `combine` function.
  - query names should be unique.
