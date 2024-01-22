'use client';

import { Tabs, theme } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { useRouter } from '@/lib/language';
import useAccessStore from '@/store/useAccessStore';
import { sleep } from 'ahooks/es/utils/testingHelpers';
import { useTranslations } from 'next-intl';
import { PageProps } from '@/typing/Layout';
import { staticRouter } from '@/static/staticRouter';
import { ChangeLanguage } from '@/components';

type LoginType = 'phone' | 'account';

export default function Login({ params: { locale } }: PageProps) {
  const { token } = theme.useToken();
  const router = useRouter();
  const [loginType, setLoginType] = useState<LoginType>('account');
  const setAccess = useAccessStore((state) => state.setAccess);
  const t = useTranslations('login');
  const tabItems = [
    { label: '账户密码登录', key: 'account' },
  ];
  const onSubmit = async () => {
    await sleep(1000);
    setAccess('canAccessSystem');
    router.push(`${staticRouter.welcome}`);
    return true;

  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer, height: '100vh' }}>
        <LoginForm
          onFinish={onSubmit}
          logo="https://randomuser.me/api/portraits/lego/1.jpg"
          title="React Next Admin"
          subTitle="基于 nextjs 的一站式 react前端框架"
          actions={
            <ChangeLanguage />
          }
        >
          <Tabs
            centered
            activeKey={loginType}
            items={tabItems}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
          </Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'用户名: admin or user'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                  strengthText:
                    'Password should contain numbers, letters and special characters, at least 8 characters long.',

                  statusRender: (value) => {
                    const getStatus = () => {
                      if (value && value.length > 12) {
                        return 'ok';
                      }
                      if (value && value.length > 6) {
                        return 'pass';
                      }
                      return 'poor';
                    };
                    const status = getStatus();
                    if (status === 'pass') {
                      return (
                        <div style={{ color: token.colorWarning }}>
                          强度：中
                        </div>
                      );
                    }
                    if (status === 'ok') {
                      return (
                        <div style={{ color: token.colorSuccess }}>
                          强度：强
                        </div>
                      );
                    }
                    return (
                      <div style={{ color: token.colorError }}>强度：弱</div>
                    );
                  },
                }}
                placeholder={'密码: admin'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              {t('auto')}
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
}
