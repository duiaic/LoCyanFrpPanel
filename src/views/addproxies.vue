<template>
  <n-h1 prefix="bar" style="margin-left: 15px;margin-top: 30px;">
    <n-text type="primary">
      添加隧道
    </n-text>
  </n-h1>
  <n-form :ref="formRef" :model="ProxyInfo" :rules="rules" label-width="auto" :size="large">
    <n-space vertical style="margin: 20px">
      <n-form-item label="选择服务器" path="node">
        <n-select v-model:value="ProxyInfo.node" :options="ServerList" />
      </n-form-item>
    </n-space>
    <div id="item">
      <p>服务器信息：</p>
      <p>服务器名：{{ ServerValue[ProxyInfo.node].name }}</p>
      <p>服务器介绍：{{ ServerValue[ProxyInfo.node].description }}</p>
      <p>服务器IP：{{ ServerValue[ProxyInfo.node].ip }}</p>
      <p>服务器域名：{{ ServerValue[ProxyInfo.node].hostname }}</p>
    </div>
    <n-grid cols="2" item-responsive>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="隧道名" path="proxy_name">
          <n-input v-model:value="ProxyInfo.proxy_name" placeholder="隧道名" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="穿透协议" path="proxy_type">
          <n-radio-group v-model:value="ProxyInfo.proxy_type">
            <n-radio-button value="1">
              TCP
            </n-radio-button>
            <n-radio-button value="2">
              UDP
            </n-radio-button>
            <n-radio-button value="3">
              HTTP
            </n-radio-button>
            <n-radio-button value="4">
              HTTPS
            </n-radio-button>
            <n-radio-button value="5">
              XTCP
            </n-radio-button>
            <n-radio-button value="6">
              STCP
            </n-radio-button>
          </n-radio-group>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="内网IP" path="local_ip">
          <n-input v-model:value="ProxyInfo.local_ip" placeholder="内网IP，例如127.0.0.1" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="内网端口" path="local_port">
          <n-input v-model:value="ProxyInfo.local_port"
            placeholder="内网端口, HTTP:80 HTTPS:443 MC:25565/19136 泰拉瑞亚:7777" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="远程端口" path="remote_port">
          <n-input v-model:value="ProxyInfo.remote_port" placeholder="映射到远程服务器上的端口" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="自定义域名" path="domain">
          <n-input v-model:value="ProxyInfo.domain" placeholder="HTTPS/HTTP需要填写，其他协议不需要填写" />
        </n-form-item>
      </n-grid-item>
    </n-grid>
    <div style="display: flex; justify-content: flex-end">
      <n-button round type="primary" @click="addproxy">
        创建
      </n-button>
    </div>
  </n-form>
</template>

<script setup>
import { NForm, NFormItem, NInput, NButton, NSpace, NSelect, NGrid, NGridItem, NRadioGroup, NRadioButton, NH1, NText } from 'naive-ui';
import { ref } from 'vue';
import store from "../utils/store.js";
import { get } from "../utils/request.js";
import router from "../router/index.js";
import { SendSuccessMessage, SendErrorMessage } from "../utils/message";
import { SendSuccessDialog } from "../utils/dialog.js"

localStorage.setItem("ViewPage", "add_proxy");

// 选择框数据
const ServerList = ref([]);
// 服务器数据
const ServerValue = ref([
  {
    id: 0,
    name: "",
    description: "",
    ip: "",
    hostname: "",
    status: 0
  }
]);
// 表格数据
const formRef = ref(null);
// 表单数据集合
const ProxyInfo = ref({
  node: 0,
  proxy_name: "",
  proxy_type: "1",
  local_ip: "127.0.0.1",
  local_port: "",
  remote_port: "",
  domain: ""
});
const rules = {
  proxy_name: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        return new Error("请输入隧道名");
      } else if (!/[A-Za-z0-9_]$/.test(value)) {
        return new Error("隧道名格式错误，由字母，数字和下划线组成");
      }
      return true;
    },
  },
  proxy_type: {
    required: true
  },
  local_ip: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        return new Error("请输入本地IP");
      } else if (!/(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))/.test(value)) {
        return new Error("本地IP格式不合法");
      }
      return true;
    }
  },
  local_port: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        return new Error("请输入本地端口");
      } else if (!/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(value)) {
        return new Error("本地端口格式不合法");
      }
      return true;
    }
  },
  remote_port: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        return new Error("请输入远程端口");
      } else if (!/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(value)) {
        return new Error("远程端口格式不合法");
      }
      return true;
    }
  },
  domain: {
    required: false,
    validator(rule, value) {
      if (!value) {
        return new Error("请输入域名");
      } else if (!/^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$/.test(value)) {
        return new Error("域名格式不合法");
      }
      return true;
    }
  }
}

function addproxy() {
  const rs = get("https://api.locyanfrp.cn/Proxies/add?username=" + store.getters.GetUserName + "&name=" + ProxyInfo.value.proxy_name + "&key=" + store.getters.GetFrpToken + "&ip=" + ProxyInfo.value.local_ip + "&type=" + ProxyInfo.value.proxy_type + "&lp=" + ProxyInfo.value.local_port + "&rp=" + ProxyInfo.value.remote_port + "&ue=0&uz=0&id=" + ProxyInfo.value.node + "&token=" + store.getters.GetToken + "&url=" + ProxyInfo.value.domain);
  rs.then(res => {
    if (res.status == true) {
      SendSuccessDialog(res.message);
    } else {
      SendErrorMessage(res.message);
    }
  })
}

const rs = get("https://api.locyanfrp.cn/Proxies/GetServerList")
rs.then(res => {
  var i = 0;
  res.forEach(s => {
    // 默认选择第一个节点
    if (i == 0) {
      ProxyInfo.value.node = s.id;
    }
    const tmpdict = {
      "label": s.name,
      "value": s.id
    };
    ServerValue.value[s.id] = s;
    ServerList.value[i] = tmpdict;
    i = i + 1;
  });
})

</script>
<style scoped>
.n-form {
  margin: 20px;
}

#item {
  max-width: 100vw;
  margin: 20px;
}

@media (max-width: 1300px) {
  .n-form {
    margin: 10px;
  }
}
</style>