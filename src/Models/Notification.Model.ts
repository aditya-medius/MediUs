import mongoose, { Schema, model } from "mongoose";
import { notifications, notificationType } from "../Services/schemaNames";
const options = { discriminatorKey: "kind" };
const notificationsSchema = new Schema(
  {
    notificationId: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "sender_ref",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiver_ref",
    },
    sender_ref: {
      type: String,
      required: true,
    },
    receiver_ref: {
      type: String,
      required: true,
    },
    notificationType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: notificationType,
    },
    content: {
      type: String,
    },
    readDetails: {
      isRead: {
        type: Boolean,
        default: false,
      },
      readDate: {
        type: Date,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  }
  // options
);

["find", "findOne"].forEach((e: string) => {
  notificationsSchema.pre(e, async function (next) {
    this.populate("notificationType");
  });
});

const notificationsModel = model(notifications, notificationsSchema);

// const requestApprovalNotification = notificationsModel.discriminator(
//   "approvalRequest",
//   new Schema({
//     idKey: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "idPath",
//       required: true,
//     },
//     idPath: {
//       type: String,
//       required: true,
//     },
//   })
// );

export default notificationsModel;
