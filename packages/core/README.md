# Dgraphium Core (QueryBuilder) [![npm version](https://badge.fury.io/js/%40dgraphium%2Fcore.svg)](https://badge.fury.io/js/%40dgraphium%2Fcore)

Query builder for Dgraph database.

## Table of contents

  - [Install](#install)
  - [Projection](#projection)
    - [Projection Merging](#projection-merging)
  - [Operators](#operators)
  - [Connecting Operators](#connecting-operators)
  - [Filtering](#filtering)
  - [Pagination](#pagination)
  - [GraphQL Types](#graphql-types)
  - [Running a Query](#running-a-query)
  - [Demo](#demo)


## Install

Install using npm:

```sh
npm install @dgraphium/core
```

or yarn:

```sh
yarn add @dgraphium/core
```

## Projection

Projection is basically an edge definition. Separately it can be
defined by: `edge({...})` which is exported from `@dgraphium/core`.

To define projection for a query:
```typescript
  query(...).project({ /* projection here */ })
```

For describing an edge, object is used. Object almost looks like the
returned value.

Each key's value type in the projection object can be:
  - `1 | true`: include field in a result.
    - if you pass `type` to containing edge/projection, `key` maps to
      field: `${capitalized type}.${key}`
    - if `type` is undefined, key maps to field with same name: `${key}`
  - `0 | false`: don't include field in a result.
  - `string`: key will map to passed value. Key simply maps to it so
    the output will be: `${key}: ${value}`
  - `Edge`: nested edge.
  - `Ref`: query/value reference.

#### Projection Merging

You can call `query.project(...)` multiple times on same query object.

By default projections will deeply merge. New keys will be added,
existing keys will be overwritten.

For example:
```typescript
query.project({ a: 1, c: { d: 1 } });
query.project({ b: 1, c: { d: 0, k: 1 } });
/* resulting projection: {
  a: 1,
  b: 1 ,
  c: { d: 0, k: 1 }
} */
```

You can do projection merging on `Edge` as well using:
`edge.merge({...})`.

---

To **overwrite** projection, you can set `overwrite` to `true`:
```typescript
query.project({ a: 1 });
query.project({ b: 1 }, true);
// resulting projection: { b: 1 }
```

In case of `Edge`: `edge.merge({...}, true)`

## Operators

Operators/Functions can be imported from `@dgraphium/core/operators`.

Supported operators:

#### basic operators

| operator  | description                                   |
|-----------|-----------------------------------------------|
| `type`    | search by **Type**                            |
| `has`     | find nodes which **has** field/edge/predicate |
| `uid`     | find by **uid**                               |
| `predUid` | find by nested edge's **uid**                 |

#### simple comparison operators

| operator | description              |
|----------|--------------------------|
| `eq`     | equals                   |
| `lt`     | less than                |
| `lte`    | less than or equal to    |
| `gt`     | greater than             |
| `gte`    | greater than or equal to |

#### text operators

| operator     | description                                                                                      |
|--------------|--------------------------------------------------------------------------------------------------|
| `regex`      | regex search                                                                                     |
| `match`      | fuzzy matching                                                                                   |
| `anyOfText`  | full-text search with stemming and stop words to find strings matching **any** of the given text |
| `allOfText`  | full-text search with stemming and stop words to find strings matching **all** of the given text |
| `anyOfTerms` | matches strings that have **any** of the specified terms in any order; **case insensitive**.     |
| `allOfTerms` | matches strings that have **all** of the specified terms in any order; **case insensitive**.     |

## Connecting Operators

**Note:** connecting operators (`LogicalOperators`) **can't** be used in `query.func(...)`.

they can be imported by:
```typescript
import { and, or, not } from '@dgraphium/core/operators';
```

## Filtering

Operators can be used in filtering queries or nested edges.

- **filtering queries**:

  For example fetch users with age between **18** and **30**:
  `query().filter(and(gt('age', 18), lt('age', 30)))`

- **filtering nested edges**:
  For example fetch user's posts, which has more than 10 likes:
  ```typescript
  query().projection({
    posts: edge().filter(gt('likes', 10)),
  });
  ```

## Pagination

All pagination methods are available for queries as well as nested edges.

- `.first(first: number)`: count of nodes to fetch (same as limit).
- `.offset(offset: number)`: node offset or amount of nodes to skip.
- `.after(id: Uid)`: fetch nodes after the `id`.

you can also use 
```typescript
.withArgs(args: {
  first: number,
  offset: number,
  after: Uid,
})
```

## GraphQL Types

If you have [GraphQL schema](https://graphql.dgraph.io/schema),
when you deploy that schema to Dgraph database, each field gets
prefixed by it's type.

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

## Combine Queries

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

## Running a Query

You can run query or [group of queries](#combine-queries) with
[@dgraphium/client](../client):
```typescript
await dgraphClient.newTxn().query(meQuery); // params will be included
```

> **Note:** you can name parameters by: `param.name(paramName)`.
> For example: `params.string('myStrValue').name('myParamName')`.
> This is useful when you want to reuse query and override parameters:
>
> for example:
> ```typescript
> await dgraphClient.newTxn().queryWithVars(
>   queryWithParam,
>   { '$myParamName': 'myStrValueNew' }
> );
> ```

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
