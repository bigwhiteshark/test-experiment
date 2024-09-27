import datetime
import time
from selenium import webdriver
from selenium.webdriver.common.by import By

from selenium.webdriver.chrome.options import Options

opts = Options()
#opts.add_argument('lang=zh_CN.UTF-8')
# Below is tested line
opts.add_argument("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")

now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
rstime = "2023-11-22 18:44:55.000000"
mstime = "2023-11-22 18:45:00.000000"
# 首先我们需要设置抢购的时间，格式要按照预设的格式改就可以了，个月数的一定在前面加上0，例如 “01”
 
WebBrowser = webdriver.Chrome(options=opts)
# 选择使用的浏览器，如果没有Chrome浏览器可以更改其他浏览器
 
#WebBrowser.get("https://www.taobao.com")
WebBrowser.get("https://www.jd.com")
time.sleep(3)
# 获取网站
 
#WebBrowser.find_element("link text", "亲，请登录").click()
WebBrowser.find_element("link text","你好，请登录").click()
print(f"请扫码登录")
time.sleep(15)
# 进入网站后读取登录链接，并扫码登录
 
#WebBrowser.get("https://cart.taobao.com/cart.htm")
WebBrowser.get("https://cart.jd.com/cart_index")
time.sleep(3)
# 登录后直接转跳到购物车页面
 
while True:
    #now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
    #if now > rstime:
        try:
            #if WebBrowser.find_element("id", "J_SelectAll1"):
            # WebBrowser.find_element("id", "J_SelectAll1").click()
            #if WebBrowser.find_element("id", "cart-body"):
            # WebBrowser.find_element("id", "cart-body").click()

            # 这里代码意思是找到购物车全选的按钮并点击全选

            #pecitemtit = WebBrowser.find_element(by=By.CSS_SELECTOR,value='.item-list .pec-item .pec-item-tit')
            #pecitemtitText = pecitemtit.text
            #print(pecitemtitText)
            #if(pecitemtitText.find('预约中') != -1):
                #WebBrowser.refresh()
            #else:
            selectAllElement = WebBrowser.find_element(by=By.NAME,value='select-all')
            selectAllElement.click()
            is_selected = selectAllElement.is_selected()
            print(is_selected)
            if is_selected == False:
                print(f"点击勾选按钮")
                WebBrowser.refresh()
            else:
                print(f"已经勾选商品")
                break
        except:
            WebBrowser.refresh()
            print(f"找不到购买按钮")
        time.sleep(0.2)
while True:
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
    #print(now)
    # print(now) 可以将实时的时间输出出来
    if now > mstime:
        # 当当前时间超过了抢购时间就立刻执行下面代码
        while True:
            try:
                # if WebBrowser.find_element("link text", "结 算"):
                    #WebBrowser.find_element("link text", "结 算").click()
                
                selectAllElement = WebBrowser.find_element(by=By.NAME,value='select-all')
                is_selected = selectAllElement.is_selected()
                if is_selected == False:
                    selectAllElement.click()
                    print(f"点击勾选按钮")
                else:
                    print(f"已经勾选商品")

                if WebBrowser.find_element(by=By.CSS_SELECTOR, value=".combine .common-submit-btn"):
                    WebBrowser.find_element(by=By.CSS_SELECTOR, value=".combine .common-submit-btn").click()
                    print(f"结算成功")
                    break
                    # 识别界面中的“结算”按钮并点击
            except:
                pass
        while True:
            try:
                #if WebBrowser.find_element("link text", '提交订单'):
                    #WebBrowser.find_element("link text", '提交订单').click()
                if WebBrowser.find_element(by=By.CSS_SELECTOR, value=".checkout-buttons .checkout-submit"):
                    WebBrowser.find_element(by=By.CSS_SELECTOR, value=".checkout-buttons .checkout-submit").click()
                    print(f"抢购成功，请尽快付款")
                    # 和上面同理，识别界面中的“提交订单”按钮
            except:
                print(f"结算提交成功,已抢到商品啦,请及时支付订单")
                break
        time.sleep(0.01)