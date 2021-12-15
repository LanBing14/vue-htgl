<template>
    <el-row class="logo-bg-wrapper">
        <div class="logo-bg-title">
            <img src="../../assets/enterprise-images/login/login-logo.png" alt="">
            <span class="logo-1">至信云创</span>
            <span class="logo-2">|</span>
            <span class="logo-3">企业中心平台</span>
        </div>
        <div class="content-title-left">
            <p class="title-1">企业服务平台，服务零距离</p>
            <p class="title-2">相伴企业成长，促进更好更快发展</p>
        </div>
        <div class="right-content login-container">
            <div class="right-content-item">
                <p class="top-title">注册</p>
                <el-form ref="registerForm" :model="registerForm" :rules="loginRules" class="login-form"
                    auto-complete="off" label-position="left">
                    <el-form-item prop="companyName">
                        <span class="svg-container">
                            <svg-icon icon-class="building" />
                        </span>
                        <el-autocomplete ref="companyNameRef" :trigger-on-focus="false" :popper-append-to-body="false"
                            v-model="registerForm.companyName" :fetch-suggestions="querySearchAsync"
                            placeholder="请输入您所属的公司名称"   class="try" :disabled="isAddMsg" @select="handleSelect"
                            style="width: 80%;">
                        </el-autocomplete>
                    </el-form-item>

                    <el-form-item prop="creditCode">
                        <span class="svg-container">
                            <svg-icon icon-class="sheCode"/>
                        </span>
                        <el-input style="position:fixed;bottom:-999999px"></el-input>
                        <el-input v-model="registerForm.creditCode" placeholder="请输入统一社会信用代码"  type="text"
                            auto-complete="off" />
                    </el-form-item>

                    <el-form-item prop="phoneNo">
                        <span class="svg-container">
                            <svg-icon icon-class="phone" />
                        </span>
                        <el-input v-model="registerForm.phoneNo" placeholder="请输11位手机号码" name="phoneNo" type="text"
                            auto-complete="off" />
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-row align="middle" type="flex">
                            <el-col :span="13">
                                <span class="svg-container">
                                    <svg-icon icon-class="message" />
                                </span>
                                <el-input v-model="registerForm.code" placeholder="请输入6位短信验证码" name="code" type="text"
                                    auto-complete="off" style="width: 76%;" />
                            </el-col>
                            <el-col :span="11" align="right">
                                <el-button :disabled="sum < 61" @click.native.prevent="checkPhone" type="primary"
                                    size="medium"
                                    style="text-align: right; margin-right: 6px;padding-left: 10px;padding-right: 10px;">
                                    {{
                                    sum === 61 ? "获取验证码" : sum + "s后重新获取"
                                    }}
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <!-- <el-form-item prop="email">
                        <span class="svg-container">
                            <svg-icon icon-class="email" />
                        </span>
                        <el-input v-model="registerForm.email" placeholder="请输入您的工作邮箱" name="userName" type="text"
                            auto-complete="off" />
                    </el-form-item> -->
                    <!-- <el-form-item prop="username">
                        <span class="svg-container">
                            <svg-icon icon-class="user" />
                        </span>
                        <el-input v-model="registerForm.username" placeholder="请输入用户名，字母、数字混合组成" name="userName"
                            type="text" auto-complete="off" />
                    </el-form-item> -->
                    <el-form-item prop="password">
                        <span class="svg-container">
                            <svg-icon icon-class="password" />
                        </span>
                        <el-input :type="passwordType" v-model="registerForm.password"
                            placeholder="请输入登录密码(字母+数字，8-20位)" name="password" auto-complete="off"
                            @keyup.enter.native="handleSure('registerForm')" />
                        <span class="show-pwd" @click="showPwd">
                            <svg-icon :icon-class="
                            passwordType === 'password' ? 'eye' : 'eye-open'
                        " />
                        </span>
                    </el-form-item>
                    <div class="o">
                        <el-checkbox v-model="radioChecked" class="agg">我已阅读并同意</el-checkbox>
                        <el-button type="text" @click="openXiyi" style="font-size: 13px!important;">《用户服务协议与隐私政策》
                        </el-button>
                    </div>
                    <el-button :loading="loading" @click.native.prevent="handleSure('registerForm')" size="medium"
                        style="width:100%;" type="primary">提交注册
                    </el-button>
                    <el-row :span="24" class="tips" justify="space-between" type="flex">
                        <p style="margin: 10px auto;font-size: 12px;" @click="goLogin">
                            <span style="color: #606266;">已有账号？</span>
                            <span>返回登录</span>
                        </p>
                    </el-row>
                </el-form>
                <el-dialog :visible.sync="visible" :append-to-body="true" class="agg-wrap" title="用户服务协议与隐私政策"
                    width="900px">
                    <p style="text-align:center"><span style="font-size:10.5pt"><span><span
                                    style="font-size:24.0000pt"><span><span>用户服务协议与隐私政策</span></span></span></span></span>
                    </p>
                    <p style="text-align: justify;"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>一、特别提示：</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>欢迎使用至信云创</span></span></span><span
                                    style="font-size:10.5000pt"><span>-企业</span></span><span
                                    style="font-size:10.5000pt"><span><span>企业中心平台（以下简称</span>“企业中心”）！</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>您访问和使用有关网站、服务、应用程序提供的企业信用相关服务适用于本用户服务协议（以下简称</span>“协议”），在您注册、使用有关网站、应用程序及接受我司提供的企业信用相关服务之前，请您认真</span></span><span
                                    style="font-size:10.5000pt"><span><span>阅读本</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>协议，</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>确保您充分理解本协议中各条款</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>。</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。</span>
                                        <span>本协议约定</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>企业中心</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>与用户之间关于</span>“用户服务协议”（以下简称“服务”）的权利</span></span><span
                                    style="font-size:10.5000pt"><span><span>和</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>义务。</span>“用户”是指注册、登录、使用本服务的个人。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>企业中心</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>提供一站式园区企业服务、公共服务、智能应用</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>等</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>解决方案，</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>企业中心</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>将用户划分为两类，企业中心免费试用用户（下称试用用户）及企业中心正式入驻用户（下称正式用户），除本</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>《协议》</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>另有明确规定外，对于企业中心线下进行单独签约大客户，在产品服务或者计费方式上，需要与技术客服另行了解与确认。单独的服务协议与本</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>《协议》</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>有冲突的地方，以单独的服务协议为准。如用户使用该服务，视为对相关服务协议的接受。</span>
                                    </span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>二、服务对象</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1.1、要成为企业中心用户，必须同时具备下列条件：</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>1）完全同意此《企业中心服务协议》；</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>2）企业中心的正式注册用户；</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1.2、企业中心用户类型：</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>1）试用用户：无需任何费用享受对应产品服务；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>2）正式用户：需支付对应产品服务等级的费用；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>三、服务内容</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>2.1、产品服务</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>用户可以使用企业中心提供的产品服务，用于企业服务、企业信管、智能应用等。另外根据客户所处园区的不同，享有产品服务会有相应差别详细如下：</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>1）试用用户，只能使用免费开放的产品服务；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>2）正式用户，可以使用企业中心开放的对应等级的产品服务；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>3）企业中心提供的数据仅供参考使用，企业中心不对其做法律担保</span></span><span
                                    style="font-size:10.5000pt"><span><span>、</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>准确及一致性做承诺。企业中心尽可能从技术上确保数据的有效性。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>2.2、定制服务</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>如企业中心所提供的产品服务不能满足用户的需求，用户可以联系企业中心客服人员申请产品定制服务，具体需要企业中心技术人员进行评估。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>四、服务内容的变更、中断和结束</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>3.1、企业中心致力于为用户提供更优质更稳定的产品服务，期间企业中心可能会做一些平台优化升级，将会在重要页面上提示修改内容或以其他方式通知用户，若由于用户疏忽通知而导致的自身应用损失，企业中心无需对此承担任何责任。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>3.2、企业中心对因不可抗力(包括但不限于自然灾害、罢工、骚乱、物质短缺或定量配给、暴动、战争行为、政府行为、通讯或其他设施故障或严重伤亡事故等)、计算机病毒或黑客攻击等造成的服务中断或不能满足用户的要求不承担责任。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>3.3、企业中心有权判定用户的行为是否符合本《服务协议》的要求，如果用户违背了本《服务协议》的规定，企业中心有权中断或终止对其提供的服务，或者采取其他企业中心认为合适的措施。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>3.4、用户必须一直符合相应认证身份的条件，否则企业中心有权将其用户身份收回。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>3.5、企业中心受客户委托对数据进行查询，本身不是源数据的所有者，不承担数据有效性保证。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>五、用户的账号，密码和安全性</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1、用户一旦成为企业中心正式注册用户，即享受对应的企业中心产品服务。用户可随时根据需要改变自己的密码，并应对密码严格保密。用户若发现任何非法使用或存在安全漏洞的情况，请立即以书面或者邮件形式告知企业中心。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>2、用户对用户名和密码的安全负全部责任，同时对以其用户名进行的所有活动和事件负全责。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>3</span></span><span
                                    style="font-size:10.5000pt"><span><span>、如果用户泄漏了密码，有可能导致不利的法律后果，因此不管任何原因导致用户的密码安全受到威胁，应该立即和</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>企业中心</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>客服人员取得联系，否则后果自负。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>4</span></span><span
                                    style="font-size:10.5000pt"><span><span>、</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>由于用户注册过程中需手机验证码验证，所以请用户注意使用</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>企业中心</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>发送的手机验证码。如由于用户自己的过失将验证码泄露给他人，一切后果由用户自己负责，</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>企业中心</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>不承担任何责任。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>六、用户声明与保证</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1、用户承诺其为具有完全民事行为能力的民事主体，且具有达成交易履行其义务的能力。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>2、用户有义务在注册时提供自己的真实资料，并保证诸如手机号码、姓名、所在地区等内容的有效性及安全性，保证</span></span><span
                                    style="font-size:10.5000pt"><span><span>企业中心</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>工作人员可以通过上述联系方式与用户取得联系。同时，用户也有义务在相关资料实际变更时及时更新有关注册资料。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>3、</span></span><span
                                    style="font-size:10.5000pt"><span><span>用户通过使用</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>企业中心</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>平台的过程中</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>，</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>不得利用企业中心提供的数据危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用企业中心提供的数据制作、复制和传播下列信息：</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>1）反对宪法所确定的基本原则的；</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>3）损害国家荣誉和利益的；</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>4）煽动民族仇恨、民族歧视，破坏民族团结的；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>5）破坏国家宗教政策，宣扬邪教和封建迷信的；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>6）散布谣言，扰乱社会秩序，破坏社会稳定的；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>8）侮辱或者诽谤他人，侵害他人合法权益的；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span></span></span><span
                                    style="font-size:10.5000pt"><span>9）含有法律、行政法规禁止的其他内容的。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>4、您同意并接受，企业中心向您提供的有关企业的董事、监事、高级管理人员（以上人员简称“信息主体”）与其履行职务相关的信息类的数据服务，是由您向企业中心提供信息主体的相关信息，企业中心通过自身平台查询并生成数据服务，对于您向企业中心提供的信息主体的相关信息的行为和您所提供的信息主体的相关信息，您保证已经取得信息主体的书面授权，信息主体明确同意由企业中心查询、收集、核验、生成其相关的信息，包括但不限于：</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span>1）</span></span><span
                                    style="font-size:10.5000pt"><span><span>、信息主体的身份信息，包括但不限于姓名</span>/名称、证件号码、证件类型、住所地、电话号码及其他身份信息；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>（</span>2）</span></span><span
                                    style="font-size:10.5000pt"><span><span>、信息主体的其他相关信息。您应保证向企业中心提供正确、完整、真实、合法的信息主体的信息并取得信息主体的授权，若因您提供的信息主体的信息不准确、不合法导致企业中心遭受行政处罚、第三方提起诉讼或侵权主张的，您应承担全部责任，若企业中心因上述情形而遭受任何损失，您应依法赔偿。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>七、违约赔偿</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1、如因企业中心违反有关法律、法规或本服务协议项下的任何条款而给用户造成损失，企业中心同意承担由此造成的损害赔偿责任，且赔偿金额不得超过剩余未使用的</span></span><span
                                    style="font-size:10.5000pt"><span><span>已</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>付款金额。</span></span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>2、用户同意保障和维护企业中心及其他用户的利益，如因用户违反有关法律、法规或本《服务协议》项下的任何条款而给企业中心或任何其他第三者造成损失，用户同意承担由此造成的损害赔偿责任。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>八、服务协议的变更</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>企业中心有权在必要时修改本《服务协议》的所有服务协议，服务协议一旦发生变动，将会在重要页面上提示修改内容或以其他方式通知用户。如果用户不接受服务协议的修改，可以随时停止使用企业中心提供的服务。</span></span></span><span
                                    style="font-size:10.5000pt"><span>&nbsp;<span>如果用户继续享用企业中心数据服务，则视为接受本《服务协议》服务协议的变动。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>九、法律适用</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>本服务协议的生效、履行、解释及争议均适用中华人民共和国法律，您同意有关本服务协议以及使用风信标产品服务产生的争议交由江苏未至科技股份有限公司住所地法院以诉讼方式解决。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>十、知识产权归属</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1、</span></span><span
                                    style="font-size:10.5000pt"><span><span>企业中心</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>所提供的各项服务的所有权和运作权归江苏未至科技股份有限公司。除特别说明或者法律另有特别规定者外，本公司是</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>风信标</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>及其中所发布的全部资料、信息的知识产权的唯一所有人。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>2、本网站所发布的全部资料包括但不限于</span></span><span
                                    style="font-size:10.5000pt"><span><span>产品、技术、软件、程序、数据及其他信息（包括但不限于文字、图像、图表、版面设计、电子文档）</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>，以及依据本网站独有的分析模型计算的数据信息。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>3、</span></span><span
                                    style="font-size:10.5000pt"><span><span>未经江苏未至科技股份有限公司书面授权许可，任何人不得擅自（包括但不限于：以不合理或不合法的方式抓取、复制、传播、展示、镜像、上载、下载、非通过未至科技购买）获取或使用至信云创的数据、信息和资料，或通过不当方式影响至信云创的正常服务，任何人不得擅自以软件程序自动获得至信云创数据。否则，将依法追究其法律责任。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>4、</span></span><span
                                    style="font-size:10.5000pt"><span><span>除法律特别规定或者政府明确要求者外，在未取得本站书面明确许可前，任何单位或者个人不得将本网站的任何知识产权对象进行任何目的的使用。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>5</span></span><span
                                    style="font-size:10.5000pt"><span><span>、任何违反本站知识产权声明的行为，本站保留进一步追究法律责任的权利。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>十一、其他规定</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1、本《服务协议》构成双方对本《服务协议》之约定事项及其他有关事宜的完整服务协议，除本《服务协议》规定的之外，未赋予本《服务协议》各方其他权利。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>2、如本《服务协议》中的任何条款无论因何种原因完全或部分无效或不具有执行力，本《服务协议》的其余条款仍应有效并且有约束力。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>3、本《服务协议》中的标题仅为方便而设，在解释本《服务协议》时应被忽略。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>4、本《服务协议》未明确列出的事项，至信云创保有最终解释权</span></span><span
                                    style="font-size:10.5000pt"><span><span>，</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>请在使用时咨询客服。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>十二、意见及建议</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>用户对服务任何部分或本服务协议的任何部分之意见及建议可通过官方网站（</span></span></span><span
                                    style="font-size:10.5000pt"><span>https://</span></span><span
                                    style="font-size:10.5000pt"><span>www</span></span><span
                                    style="font-size:10.5000pt"><span>.fengxinbiao.cn/）反馈给风信标。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span><strong><strong><span
                                            style="font-size:16.0000pt"><span><strong><span>十三、隐私权政策</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>企业中心重视用户的隐私权，我们也深知您向风信标提供各种信息是基于对企业中心的完全信任。您在同意风信标服务协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于企业中心服务协议不可分割的一部分。企业中心的宗旨是以诚信为本，我们一定会以负责的态度对待您提交给我们的信息，企业中心郑重承诺如下：</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1、企业中心郑重承诺不会出售用户的任何信息，并保护您的电子邮件、手机号码、姓名等个人隐私信息。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>2、企业中心采取了有效的措施保护您的个人隐私资料。除非根据法律或政府的强制性规定，否则在未得到用户的许可之前，我们不会把用户的任何个人资料提供给无关的第三方（包括公司或个人）。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>下面是具体的阐述企业中心如何处理用户的隐私问题：</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span
                                style="font-family:&quot;等线 Light&quot;"><strong><strong><span
                                            style="font-size:16.0000pt"><span
                                                style="font-family:'等线 Light'"><strong><span
                                                        style="font-family:等线 Light">(一)&nbsp;
                                                        我们所收集的信息以及如何使用</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1.1、用户提交资料</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>当您注册企业中心时，</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>根据要求提供的注册信息</span></span></span><span
                                    style="font-size:10.5000pt"><span><span>，您需要提供电子邮件地址，以便我们识别您的身份或与您联络。我们会利用一些有效方法，确认您的个人资料的正确性与有效性。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1.2、用户的个人详细资料</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>除了注册必填信息之外，我们还有一部分关于您更细致描述的信息，例如姓名、所在公司、职位等，您可以选择填写与否。但是您的资料越完整，您的提供的信息越丰富，就越有可能获得更多的机会和商务社交关系。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1.3、联系人的信息</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>当您邀请您的朋友加入风信标时，您需要填写对方的姓名，手机号或是邮箱地址。这些信息仅会被用来给您的联系人发出邀请或是其他信息之用。您也可以自行为您的联系人填加一些个人信息，但是至信云创保证这些信息仅会被您看到。您为您联系人所填信息也符合此隐私条款。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1.4、非个人资料辨别</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>我们除了向您收集个人资料以便为您提供服务以外，还可能通过您的</span></span></span><span
                                    style="font-size:10.5000pt"><span>IP地址收集一些非个人隐私的统计资料，使我们能够进一步改善风信标的服务。例如，当您浏览一个网页时，此网址、当时的时间、您所使用的浏览器性质、给您提供接入服务的ISP等，都会被自动记录下来。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>1.5、COOKIE</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>Cookie
                                        是指从网络服务器发送到您的浏览器，并储存到电脑硬盘上的少量数据，通常包括一些特殊标识符，是用来记录您的使用者
                                        ID。您以根据自己的喜好，设定接收所有cookies，拒收所有 cookies ，或在设定 cookie 时得到通知。然而您必须在开启您的
                                        cookies时才能使用企业中心所提供的服务。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span
                                style="font-family:&quot;等线 Light&quot;"><strong><strong><span
                                            style="font-size:16.0000pt"><span
                                                style="font-family:'等线 Light'"><strong><span
                                                        style="font-family:等线 Light">(二)&nbsp;
                                                        信息公开与共享</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>用户的信息将会被分类分级别的，按照用户个人的意愿展示给其联络人。至信云创不会将您的个人资料提供给任何人。但以下情况除外：</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>(1) 已获得用户的明确授权；</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>(2)
                                        根据有关法律法规的要求或按照行政、司法机构的要求；</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>(3) 为维护风信标的合法权益；</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>(4)
                                        为维护企业中心的用户和社会公众的合法权益；</span></span></span></span></p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span>(5) 企业中心认为有必要的其他情况。</span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span
                                style="font-family:&quot;等线 Light&quot;"><strong><strong><span
                                            style="font-size:16.0000pt"><span
                                                style="font-family:'等线 Light'"><strong><span
                                                        style="font-family:等线 Light">(三)&nbsp;
                                                        信息的更新和删除</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>为了使您能和您的联系人保持长久的联系，在您的个人资料有变动的情况下，您可以更新和修改您的个人资料已使其有效。您在任何时候都能非常容易地使用您的注册名与密码登录企业中心以修改或删除您的个人资料及档案。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span
                                style="font-family:&quot;等线 Light&quot;"><strong><strong><span
                                            style="font-size:16.0000pt"><span
                                                style="font-family:'等线 Light'"><strong><span
                                                        style="font-family:等线 Light">(四)&nbsp;
                                                        保护您的隐私</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>我们将采取严格的措施保护您的隐私，确保您的隐私权不受任何侵犯。只要您提供给我们任何个人信息，我们都会采取有效的手段保护您的信息（法律或政府的强制性规定不在此限）。</span></span></span></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:16pt"><span
                                style="font-family:&quot;等线 Light&quot;"><strong><strong><span
                                            style="font-size:16.0000pt"><span
                                                style="font-family:'等线 Light'"><strong><span
                                                        style="font-family:等线 Light">(五)&nbsp;
                                                        更新隐私条款</span></strong></span></span></strong></strong></span></span>
                    </p>
                    <p style="text-align:justify"><span style="font-size:10.5pt"><span><span
                                    style="font-size:10.5000pt"><span><span>企业中心可能会对隐私权政策进行修改。如果在使用用户个人信息政策方面有大幅度修改时，我们会通过电子邮件通知您。本隐私保护制度最后一次更新时间为</span></span></span><span
                                    style="font-size:10.5000pt"><span>2021年8月25日。</span></span></span></span></p>
                </el-dialog>

            </div>
        </div>
    </el-row>
</template>

<script>
    import { getJessionID, setToken, setRefToken } from "@/utils/auth";
    import { validPhone } from "@/utils/index";
    import { Api_Send2 } from "@/api/baseApi";
    import { isNull, MD5 } from "@/utils/commonUtils";
    import {
        Api_RegisterFxbUser,
        Api_checkCompanyName,
        Api_byPhone,
        Api_IsPhoneUsed
    } from "@/api/userCenter/baseInfo";
    import store from "@/store";
    import router from "@/router";
    import CryptoJS from "crypto-js";
    import {
        Api_SearchCompany,
    } from "@/api/creditManagement/customerProfile/customerManagement.js";
    export default {
        name: "Register",
        data() {
            const createRules = this.$createRules;
            const validateUsername = (rule, value, callback) => {
                const validateReg = /^[a-zA-Z][0-9a-zA-Z]{5,19}$/;
                if (isNull(value)) {
                    callback(new Error("用户名必填"));
                } else if (!validateReg.test(value)) {
                    callback(new Error("必须以字母开头 ，长度6-20位"));
                } else if (value.indexOf("admin") !== -1) {
                    callback(new Error("不可包含admin关键字符"));
                } else {
                    callback();
                }
            };
            return {
                loadingY: '', // 加载loading
                isAddMsg: false,
                content: "",
                dialogVisible: false,
                registerForm: {
                    companyName: "",
                    // email: "",
                    // username: "",
                    password: "",
                    phoneNo: "",
                    code: "",
                    creditCode:""
                },
                loginRules: {
                    // email: [
                    //     { required: true, trigger: "blur", message: "邮箱必填" },
                    //     { type: "email", message: '邮箱格式不正确', trigger: "blur" }
                    // ],
                    companyName: [
                        {
                            required: true,
                            trigger: "change",
                            message: "企业名称必填"
                        },
                    ],
                    // username: [{ validator: validateUsername, trigger: "blur" }],
                    password: [
                        { required: true, trigger: "blur", message: "密码必填" },
                        {
                            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/,
                            message: "密码必须由字母和数字组成且长度为8-20位"
                        }
                    ],
                    phoneNo: [
                        {
                            required: true,
                            trigger: "blur",
                            message: "手机必填"
                        },
                        {
                            pattern: /^1[3456789]\d{9}$/,
                            message: "手机号码格式错误",
                            trigger: "blur"
                        }
                    ],
                    code: [
                        {
                            required: true,
                            trigger: "blur",
                            message: "手机验证码必填"
                        }
                    ],
                   creditCode:createRules({
                        msg:'统一社会信用代码',
                        isCode:true,
                    },'blur'),
                },
                passwordType: "password",
                key: "deskeyfor#90!she",
                loading: false,
                redirect: undefined,
                sum: 61,
                timer: "",
                radioChecked: false,
                visible: false,
                companyIds:'',
                parkCode:''
            };
        },
        methods: {
            goLogin() {
                this.$router.push('/login')
            },
            handleSelect(item) {
                // this.confirmCompanyForm.id = item.id;
                // this.confirmCompanyForm.code = item.code;
                // this.confirmCompanyForm.companyId = item.id;
                this.registerForm.companyName = item.value;
            },
            querySearchAsync(queryString, cb) {
                Api_SearchCompany({ companyName: queryString })
                    .then(res => {
                        
                        const temp = [];
                        for (const elem of res.returnData) {
                            temp.push({
                                value: elem.name,
                                id: elem.id,
                                code: elem.creditCode
                            });
                        }
                        cb(temp);
                    })
                    .catch(e => {
                        cb([]);
                        // this.$message.warning("请输入更详细的关键词");
                    });
            },
            continueRe() {
                this.dialogVisible = false
                this.registerNext()
            },
            atOncere() {
                this.dialogVisible = false
                this.$refs.companyNameRef.focus()
            },
            // 密码显隐
            showPwd() {
                if (this.passwordType === "password") {
                    this.passwordType = "";
                } else {
                    this.passwordType = "password";
                }
            },
            registerNext() {

                this.loadingY = this.$openLoading();
                Api_RegisterFxbUser({
                    smsCode: this.registerForm.code,
                    password: this.encryptByDES(this.registerForm.password, this.key),
                    mobile: this.registerForm.phoneNo,
                    companyId:  this.companyIds,
                    companyName: this.registerForm.companyName,
                    parkCode: this.parkCode,
                    creditCode:this.registerForm.creditCode
                }).then(data => {
                    this.$message({
                        message: "注册成功",
                        type: "success",
                        duration: 1000
                    });
                    this.loadingY.close();

                    Api_byPhone({
                        mobile: this.registerForm.phoneNo,
                        password: this.encryptByDES(this.registerForm.password, this.key),
                        roleType: '1',
                        grant_type: 'custom_mobile_pwd'
                    }).then(({ access_token, refresh_token }) => {
                        // this.$login.close();
                        this.loadingY.close();
                        setToken(access_token);
                        setRefToken(refresh_token)
                        store.dispatch('GetUserInfo');
                        router.replace({
                            path: "/",
                            query: { IsShowF: '1' }
                        });
                    })
                }).catch(e => {
                    // this.$login.close();
                    this.loadingY.close();
                    this.loading = false;
                    this.$message({
                        message: e,
                        type: "error",
                        duration: 1000
                    });
                });
            },
            // 验证手机
            checkPhone() {
                if (!validPhone(this.registerForm.phoneNo)) {
                    this.$message({
                        message: "请输入正确的11位手机号码",
                        type: "warning",
                        duration: 5 * 1000
                    });
                    return;
                }
                this.sendMsg()
            },
            // 发送短信验证码
            sendMsg() {
                // 倒计时60秒后,可以重新发送短信
                this.sum = 61;
                this.timer = setInterval(() => {
                    this.sum--;
                    if (this.sum < 1) {
                        this.sum = 61;
                        clearInterval(this.timer);
                    }
                }, 1000);
                Api_Send2({
                    mobile: this.registerForm.phoneNo,
                    // msg: "用户登录身份验证",
                    templateType: "2" // 注册
                }).then(res => {
                    this.$message.success(res)
                }).catch(res => {
                    this.$message.error(res)
                });
            },
            // DES 解密 加密
            encryptByDES(message, key) {
                const keyHex = CryptoJS.enc.Utf8.parse(key);
                const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.toString();
            },
            // 确认
            handleSure(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (!this.radioChecked) {
                            this.$message.error("请阅读并同意用户服务协议与隐私政策");
                            return false;
                        }
                        this.loading = true;
                        Api_checkCompanyName({ 
                            companyName: this.registerForm.companyName,
                            creditCode: this.registerForm.creditCode
                         }).then(res => {
                            this.companyIds = res.companyId
                            this.parkCode = res.parkCode
                            if (!res.companyId) {
                                this.loading = false;
                                this.$confirm('您填写的企业名称未查找到，建议修改企业名称后再进行注册?', '提示', {
                                    confirmButtonText: '继续注册',
                                    cancelButtonText: '立即修改',
                                    type: 'warning'
                                }).then(() => {
                                    this.registerNext()
                                }).catch(() => {
                                    this.$refs.companyNameRef.focus()
                                });

                            } else {
                                this.registerNext()
                            }
                        })
                    }
                });
            },
            // 重置表单
            resetForm() {
                this.$refs["registerForm"].resetFields();
            },
            openXiyi() {
                this.radioChecked = true
                // window.open('/agreement')
                this.visible = true
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    $dark_gray: #889aa4;
    $orange: #fd4a37;
    $light-blue: #4b9df3;

    .content-title-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        position: absolute;
        left: 10%;

        p.title-1 {
            font-size: 52px;
            line-height: 95px;
            letter-spacing: 3px;
            color: #fff;
        }

        p.title-2 {
            font-size: 24px;
            line-height: 47px;
            color: #fff;
        }
    }

    .logo-bg-title {
        position: absolute;
        left: 6%;
        top: 7%;
        color: #fff;

        img {
            margin-top: -20px;
        }

        .logo-1 {
            font-size: 36px;
            margin-left: 10px;
        }

        .logo-2 {
            width: 2px;
            height: 25px;
            background-color: #ffffff;
            margin: 0 25px;
        }

        .logo-3 {
            font-size: 18px;
        }
    }

    .login-container {

        .tips {
            font-size: 14px;
            color: #fff;
            text-align: right;
            margin: 15px 0 15px 0;

            span {
                color: $light-blue;

                &:hover {
                    cursor: pointer;
                    color: lighten($light-blue, 3%);
                }

                &:last-child {
                    margin-left: 10px;
                }
            }
        }
    }

    /deep/.el-checkbox__label {
        font-size: 12px;
    }

    .el-form-item {
        border: 1px solid #dee2e6;
        background-color: #fff;
        border-radius: 5px;
        color: #454545;
    }

    .el-scrollbar__view {
        height: 100%;
        .logo-bg-wrapper{
            flex: 1;
            overflow: hidden;
            height: 100%;
            background: url(../../assets/enterprise-images/login/login_bg.jpg) no-repeat;
            background-size: 100% 100%;
        }
  }

    .right-content {
        width: 20%;
        position: absolute;
        right: 6%;
        top: 50%;
        transform: translateY(-50%);
    }

    .top-title {
        font-size: 20px;
        margin: 0;
        font-weight: 500;
        text-align: center;
        color: #303133;
    }

    .login-form {
        width: 100%;
        margin-top: 15px;
        background: rgba(255, 255, 255, 0.6);
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin: 5px 0 15px 0;

        span {
            color: $light-blue;

            &:hover {
                cursor: pointer;
                color: lighten($light-blue, 3%);
            }
        }
    }

    .svg-container {
        padding-left: 17px;
        color: $dark_gray;
        vertical-align: middle;
        width: 34px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $orange;
            margin: 0 auto 40px auto;
            text-align: center;
            font-weight: normal;
        }

        .set-language {
            color: #fff;
            position: absolute;
            top: 5px;
            right: 0;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }

    .change-code {
        position: absolute;
        right: 6px;
        top: 4px;
        bottom: 4px;
        font-size: 0;
        line-height: normal;
        cursor: pointer;
        user-select: none;
    }

    .agg {
        margin-right: 0;
    }

    .o {
        text-align: center;
        margin: 15px 0;
        padding-top: 15px;

        .el-button {
            padding: 0;
        }
    }

    .agg-wrap {
        line-height: 1.6;

        p {
            margin: 1em 0;
        }

        /deep/ .el-dialog__body {
            padding-left: 40px;
            padding-right: 40px;
            overflow: auto;
            height: calc(100vh - 110px - 15vh);
        }
    }

    .borderNone {
        text-align: center;

        /deep/ .el-dialog__body {
            padding-left: 40px;
            padding-right: 40px;
            overflow: auto;
            height: auto;
        }
    }

    .borderNone /deep/ .el-dialog__header {

        border-bottom: none;

    }


    /deep/ .el-input__inner {
        padding-left: 55px;
        height: 50px;
        line-height: 50px;
    }
</style>


<style lang="scss">
    .login-form {
        .try {
            width: 100%;

            .el-autocomplete-suggestion {
                width: 309px !important;
            }
        }
    }
</style>
