const { KinesisClient, PutRecordsCommand } = require('@aws-sdk/client-kinesis');

/**
 * @type {KinesisClient}
 */
let kinesisClient = undefined;

/**
 * 初始化cloudwatch
 */
function _init() {
    if (!kinesisClient) {
        kinesisClient = new KinesisClient();
    }
}

/**
 * 更新kinesis记录
 * @param {Array<object>} records 指标数据的数组
 * @param {string} records.Data 指标名
 * @param {string} records.PartitionKey 数据存储的分区键，目前为字符串格式的毫秒级时间戳
 * @param {string} streamName 传输流的名字
 */
async function putRecords(records, streamName) {
    _init();
    const input = { // PutRecordsInput
        Records: records,
        /*
        [ // PutRecordsRequestEntryList // required
            { // PutRecordsRequestEntry
                Data: new Uint8Array(), // e.g. Buffer.from("") or new TextEncoder().encode("")       // required
                ExplicitHashKey: "STRING_VALUE",
                PartitionKey: "STRING_VALUE", // required
            },
        ]
        */
        StreamName: streamName,
    };
    const command = new PutRecordsCommand(input);
    const response = await kinesisClient.send(command);
    // { // PutRecordsOutput
    //   FailedRecordCount: Number("int"),
    //   Records: [ // PutRecordsResultEntryList // required
    //     { // PutRecordsResultEntry
    //       SequenceNumber: "STRING_VALUE",
    //       ShardId: "STRING_VALUE",
    //       ErrorCode: "STRING_VALUE",
    //       ErrorMessage: "STRING_VALUE",
    //     },
    //   ],
    //   EncryptionType: "NONE" || "KMS",
    // };
}

module.exports = {
    putRecords,
};