<template>
  <div>
    <div>
      <input type="checkbox" id="account-name-setter-modal" class="modal-toggle" :checked="modals['account-name-setter'].showed">
      <account-name-setter></account-name-setter>
    </div>

    <div>
      <input type="checkbox" id="new-account-modal" class="modal-toggle" :checked="modals['new-account'].showed">
      <new-account></new-account>
    </div>

    <div>
      <input type="checkbox" id="new-transaction-modal" class="modal-toggle" :checked="modals['new-transaction'].showed">
      <new-transaction></new-transaction>
    </div>

    <div>
      <input type="checkbox" id="new-tag-modal" class="modal-toggle" :checked="modals['new-tag'].showed">
      <new-tag></new-tag>
    </div>

    <div>
      <input type="checkbox" id="tag-editor-modal" class="modal-toggle" :checked="modals['tag-editor'].showed">
      <tag-editor></tag-editor>
    </div>

    <div>
      <input type="checkbox" id="new-plan-modal" class="modal-toggle" :checked="modals['new-plan'].showed">
      <new-plan></new-plan>
    </div>

    <div>
      <input type="checkbox" id="plan-editor-modal" class="modal-toggle" :checked="modals['plan-editor'].showed">
      <plan-editor></plan-editor>
    </div>

    <div>
      <input type="checkbox" id="new-repeat-transaction-modal" class="modal-toggle" :checked="modals['new-repeat-transaction'].showed">
      <new-repeat-transaction></new-repeat-transaction>
    </div>

    <div>
      <input type="checkbox" id="repeat-transaction-editor-modal" class="modal-toggle" :checked="modals['repeat-transaction-editor'].showed">
      <repeat-transaction-editor></repeat-transaction-editor>
    </div>

    <div>
      <input type="checkbox" id="receipt-token-setter-modal" class="modal-toggle" :checked="modals['receipt-token-setter'].showed">
      <receipt-token-setter></receipt-token-setter>
    </div>

    <div>
      <input type="checkbox" id="transaction-editor-modal" class="modal-toggle" :checked="modals['transaction-editor'].showed">
      <transaction-editor></transaction-editor>
    </div>

    <div>
      <input type="checkbox" id="account-transfer-modal" class="modal-toggle" :checked="modals['account-transfer'].showed">
      <account-transfer></account-transfer>
    </div>

    <div>
      <input type="checkbox" id="qr-scanner-modal" class="modal-toggle" :checked="modals['qr-scanner'].showed">
      <q-r-scanner></q-r-scanner>
    </div>

    <div>
      <input type="checkbox" id="admin-password-changer-modal" class="modal-toggle" :checked="modals['admin-password-changer'].showed">
      <change-password-user></change-password-user>
    </div>

    <div>
      <input type="checkbox" id="admin-notify-user-modal" class="modal-toggle" :checked="modals['admin-notify-user'].showed">
      <notify-user></notify-user>
    </div>

  </div>
</template>

<script>
import AccountNameSetter from "./accountNameSetter";
import NewAccount from "./newAccount";
import NewTransaction from "./newTransaction";
import NewTag from "./newTag";
import TagEditor from "./tagEditor";
import NewPlan from "~/components/modals/newPlan";
import PlanEditor from "~/components/modals/planEditor";
import NewRepeatTransaction from "./newRepeatTransaction";
import RepeatTransactionEditor from "./repeatTransactionEditor";
import ReceiptTokenSetter from "./receiptTokenSetter";
import QRScanner from "./QRScanner";
import TransactionEditor from "./transactionEditor";
import AccountTransfer from "./accountTransfer";
import ChangePasswordUser from "./admin/changePasswordUser";
import NotifyUser from "./admin/notifyUser";
export default {
  name: "modals",
  components: {
    ChangePasswordUser,
    AccountTransfer,
    TransactionEditor,
    QRScanner,
    ReceiptTokenSetter,
    RepeatTransactionEditor,
    NewRepeatTransaction,
    PlanEditor, NewPlan, TagEditor, NewTag, NewTransaction, NewAccount, AccountNameSetter, NotifyUser},

  beforeCreate() {
    this.$store.commit("createModal", "account-name-setter")
    this.$store.commit("createModal", "new-account")
    this.$store.commit("createModal", "new-transaction")
    this.$store.commit("createModal", "new-repeat-transaction")
    this.$store.commit("createModal", "new-tag")
    this.$store.commit("createModal", "tag-editor")
    this.$store.commit("createModal", "new-plan")
    this.$store.commit("createModal", "plan-editor")
    this.$store.commit("createModal", "repeat-transaction-editor")
    this.$store.commit("createModal", "receipt-token-setter")
    this.$store.commit("createModal", "transaction-editor")
    this.$store.commit("createModal", "account-transfer")
    this.$store.commit("createModal", "qr-scanner")
    this.$store.commit("createModal", "admin-password-changer")
    this.$store.commit("createModal", "admin-notify-user")
  },

  computed: {
    modals: function (){
      return this.$store.state.modals;
    },
  }
}
</script>

<style scoped>

</style>
