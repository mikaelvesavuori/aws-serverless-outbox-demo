# AWS inbox pattern demo: DynamoDB, EventBridge, Lambda

This demonstrates the [outbox pattern](TODO) as applied to a serverless architecture in AWS. An easier execution than many traditional similar solutions, here we can use DynamoDB and its Streams capability to solve the messaging/queuing otherwise required.

The key infrastructural components are Lambda, DynamoDB, and EventBridge.

## Explanation

For our demo usecase we will have a collection of books which can be added or removed. The system itself is uncomplicated.

When you call the API to add or remove a book...

```mermaid
graph TD;
    Endpoint (API Gateway)-->AddBook (Lambda);
    AddBook (Lambda)-->DynamoDB;
    DynamoDB-->DynamoDB Stream;
    DynamoDB Stream-->ChangeProcessor;
    ChangeProcessor-->BookAdded;
```

## References

- [Outbox pattern with DynamoDB and EventBridge](https://serverlessland.com/patterns/dynamodb-streams-to-eventbridge-outbox-pattern)
