# Demo React GraphQL app using the Apollo client and AWS AppSync

This App demonstrates how to use the React Apollo Client with AWS AppSync, and
two of many strategies to updating your UI and Apollo cache using the
<Mutation /> components update and optimistic response functions.

## Get started

Start by cloning or downloading the repository.

The App uses AWS AppSync so to check it out you should head over to
[Amazon AWS](http://aws.amazon.com) and create an account. AWS AppSync is free
as long as you do not use above the
[free tier](https://aws.amazon.com/appsync/pricing/), which is more than enough
to play around with GraphQL.

In the AWS Management Console find and go to the AWS AppSync service. You can do
this quite easily by searching for `app` in the AWS service panel.

### Create a sample API

Click on `Create API` and select the `Event App` from the
`Start from a sample project` panel, and click `Start`. Name your API or go with
the default name, and click `Create`. When DynamoDB has finished the setup you
are ready to execute some queries and use your new API.

Before getting up and running, we have to add a new update field to the Mutation
type and add a resolver to the update field.

Go to Schema and add the following `updateEvent` field to the `Mutation type` (l
40), and save the Schema.

```graphql
# Update a single event.
updateEvent(
    id: ID!,
    name: String!,
    when: String!,
    where: String!,
    description: String!
): Event
```

Afterward, find the newly create mutation field in the `Resolvers panel` and
click on `Attach`. Select `AppSyncEventTable` as the data source to resolve, and
replace the request mapping template with the following resolver:

```
{
    "version" : "2017-02-28",
    "operation" : "UpdateItem",
    "key" : {
        "id" : { "S" : "${context.arguments.id}" }
    },
    "update" : {
        "expression" : "SET #when = :when, #where = :where, description = :description, #name = :name",
        ## We need to map name, when and where, as they are reserved by DynamoDB
        "expressionNames": {
            "#name" : "name",
            "#when" : "when",
            "#where" : "where"
        },
        "expressionValues": {
            ":when" : { "S": "${context.arguments.when}" },
            ":where" : { "S": "${context.arguments.where}" },
            ":description" : { "S": "${context.arguments.description}" },
            ":name" : { "S": "${context.arguments.name}" }
        }
    }
}
```

Finally, you need to replace the response mapping template with the following:

```
$util.toJson($context.result)
```

and click `Save Resolver`.

As the last step you should download the `aws-exports.js` configuration file and
copy it to the project. You can get the configuration file by clicking on the
name of your API and click on `JavaScript` in the `Integrate with your App`
panel and then click on the `Download Config` button.

## Get up and running

So now you've got your GraphQL API up and running you are ready to run the APP
and explore the code. Use it as you please.

```
yarn install
yarn start
```

Enjoy
