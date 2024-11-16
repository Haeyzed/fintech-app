'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Loader2, Shield, Smartphone } from 'lucide-react';
import { type z } from 'zod';
import { useQRCode } from 'next-qrcode';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { changePasswordSchema, disable2faSchema, verify2faSchema } from '@/lib/zod';
import { changePassword, disable2FA, enable2FA, verify2FA } from '@/actions/api-actions';
import PageContainer from '@/components/page-container';
import { InputPassword } from '@/components/input-password';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
type Disable2FAFormValues = z.infer<typeof disable2faSchema>
type Verify2FAFormValues = z.infer<typeof verify2faSchema>

export default function SecurityPage() {
  const { session, update } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(session?.user?.google2fa_enabled || false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>(session?.user?.recovery_codes || []);
  const { SVG } = useQRCode();
  // useEffect(() => {
  //   if (session && session.user) {
  //     setIs2FAEnabled(session.user.google2fa_enabled || false)
  //     setRecoveryCodes(session.user.recovery_codes as string[])
  //   }
  // }, [session])

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: ''
    }
  });

  const disable2FAForm = useForm<Disable2FAFormValues>({
    resolver: zodResolver(disable2faSchema),
    defaultValues: {
      password: ''
    }
  });

  const twoFAForm = useForm<Verify2FAFormValues>({
    resolver: zodResolver(verify2faSchema),
    defaultValues: {
      one_time_password: '',
      user_id: session?.user?.id || '',
      is_setup: true
    }
  });

  const onSubmitPassword = async (values: ChangePasswordFormValues) => {
    try {
      const result = await changePassword(values);
      passwordForm.reset();
      toast.success('Success', { description: result.message });
    } catch (error) {
      console.log('Error changing password:', error);
      // toast.error(error.message || 'Failed to change password. Please try again.');
    }
  };

  const handleEnable2FA = async () => {
    try {
      const result = await enable2FA();
      setQrCodeUrl(result.data.qr_code_url);
      setTwoFASecret(result.data.secret);
      toast.success('Success', { description: result.message });
    } catch (error) {
      console.log('Error enabling 2FA:', error);
      // toast.error(error.message || 'Failed to enable 2FA. Please try again.');
    }
  };

  const handleVerify2FA = async (values: Verify2FAFormValues) => {
    try {
      const result = await verify2FA({
        ...values,
        user_id: session?.user?.id || ''
      });
      setIs2FAEnabled(true);
      setTwoFASecret('');
      twoFAForm.reset();
      setRecoveryCodes(result.data.recovery_codes);
      if(session){
        await update({
          ...session!.user,
          recovery_codes: result.data.recovery_codes,
          google2fa_enabled: true
        });
      }
      toast.success('Success', { description: result.message });
    } catch (error) {
      console.log('Error verifying 2FA:', error);
      // toast.error(error.message || 'Failed to verify 2FA code. Please try again.');
    }
  };

  const handleDisable2FA = async (values: Disable2FAFormValues) => {
    try {
      const result = await disable2FA(values);
      setIs2FAEnabled(false);
      setQrCodeUrl(null);
      setRecoveryCodes([]);
      disable2FAForm.reset();
      if (session){
        await update({
          ...session!.user,
          recovery_codes: null,
          google2fa_enabled: false
        });
      }
      toast.success('Success', { description: result.message });
    } catch (error) {
      console.log('Error disabling 2FA:', error);
      // toast.error(error.message || 'Failed to disable 2FA. Please try again.');
    }
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Security Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account security settings and preferences
          </p>
        </div>

        <Separator />

        {/* Change Password Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <InputPassword
                          {...field}
                          disabled={passwordForm.formState.isSubmitting}
                          placeholder="Enter your current password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <InputPassword
                          {...field}
                          disabled={passwordForm.formState.isSubmitting}
                          placeholder="Enter your new password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <InputPassword
                          {...field}
                          disabled={passwordForm.formState.isSubmitting}
                          placeholder="Confirm your new password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* 2FA Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!is2FAEnabled ? (
              <Button onClick={handleEnable2FA}>Enable 2FA</Button>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>2FA is enabled</AlertTitle>
                  <AlertDescription>
                    Your account is protected with two-factor authentication
                  </AlertDescription>
                </Alert>
                <Form {...disable2FAForm}>
                  <form onSubmit={disable2FAForm.handleSubmit(handleDisable2FA)} className="space-y-4">
                    <FormField
                      control={disable2FAForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <InputPassword
                              {...field}
                              disabled={disable2FAForm.formState.isSubmitting}
                              placeholder="Enter your password to disable 2FA"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" variant="destructive" disabled={disable2FAForm.formState.isSubmitting}>
                      {disable2FAForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Disabling...
                        </>
                      ) : (
                        'Disable 2FA'
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {qrCodeUrl && twoFASecret && (
              <div className="space-y-4">
                <Label>1. Scan this QR code with your Google Authenticator App. Alternatively, you can use the
                  code:</Label>
                <p className="text-center">Secret key: {twoFASecret}</p>
                <div className="flex justify-center">
                  <SVG
                    text={qrCodeUrl}
                    options={{
                      margin: 2,
                      width: 200,
                      color: {
                        dark: '#000000',
                        light: '#ffffff'
                      }
                    }}
                  />
                </div>
                <Label>2. Enter the pin from Google Authenticator app:</Label>
                <Form {...twoFAForm}>
                  <form onSubmit={twoFAForm.handleSubmit(handleVerify2FA)} className="space-y-4">
                    <FormField
                      control={twoFAForm.control}
                      name="one_time_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <InputOTP
                              maxLength={6}
                              {...field}
                              disabled={twoFAForm.formState.isSubmitting}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={twoFAForm.formState.isSubmitting}>
                      {twoFAForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {recoveryCodes.length > 0 && (
              <Alert>
                <AlertTitle>Recovery Codes</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1 font-mono text-sm">
                    {recoveryCodes.map((code) => (
                      <div key={code}>{code}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Passkey Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Passkeys
            </CardTitle>
            <CardDescription>
              Manage your passkeys for passwordless authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTitle>Coming Soon</AlertTitle>
              <AlertDescription>
                Passkey support will be available in a future update
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}