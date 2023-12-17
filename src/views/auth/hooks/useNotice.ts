import { noticeReq } from "@/api/index"
import utils from "@/libs/util"

export default () => {
  const getNoticeInfo = async () => {
    // 获取通知提醒框数据
    const [err, res] = await utils.awaitWrap(noticeReq())
    if (err) return
    if (!res || !res.result) return
    // 处理数据
    const content = res.result.content.replace(/\\n/g, "")
    ElNotification.info({
      title: res.result.title,
      dangerouslyUseHTMLString: true,
      message: content,
      duration: res.result.duration * 1000
    })
  }

  return {
    getNoticeInfo
  }
}
