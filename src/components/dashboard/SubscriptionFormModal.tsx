import { useState } from "react";
import {
  Modal,
  ModalContainer,
  ModalNavigation,
  ModalClose,
  ModalContent,
  ModalContentItem,
  ModalHeading,
  Typography,
  TextField,
  Select,
  Option,
  Button,
  FormField,
  FormErrorMessage,
  useToast,
} from "@wanteddev/wds";
import type {
  Subscription,
  SubscribeCategory,
  BillingCycle,
  PaymentMethod,
} from "../../type/subscribe";
import {
  CATEGORY_META,
  BILLING_CYCLE_META,
  PAYMENT_METHOD_META,
} from "../../type/subscribe";
import { createSubscriptions } from "../../api/subscribe";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM: Subscription = {
  serviceName: "",
  category: "OTT",
  price: 0,
  billingCycle: "MONTHLY",
  billingDay: 1,
  billingMonth: null,
  paymentMethod: "CARD",
};

type FormErrors = Partial<Record<keyof Subscription, string>>;

export default function SubscriptionFormModal({ open, onClose, onSuccess }: Props) {
  const toast = useToast();
  const [form, setForm] = useState<Subscription>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.serviceName.trim()) errs.serviceName = "서비스명을 입력하세요.";
    if (!form.price || form.price <= 0) errs.price = "금액을 입력하세요.";
    if (form.billingCycle === "YEARLY" && (!form.billingMonth || form.billingMonth < 1)) {
      errs.billingMonth = "결제 월을 선택하세요.";
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await createSubscriptions({
        ...form,
        billingMonth: form.billingCycle === "MONTHLY" ? null : form.billingMonth,
      });
      toast({ content: "구독 서비스가 등록되었습니다.", variant: "positive", duration: "short" });
      setForm(INITIAL_FORM);
      setErrors({});
      onSuccess();
      onClose();
    } catch {
      toast({ content: "등록 중 오류가 발생했습니다. 다시 시도해주세요.", variant: "negative", duration: "short" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onOpenChange={(v) => !v && handleClose()}>
      <ModalContainer size="medium">
        <ModalNavigation trailingContent={<ModalClose />}>
          <ModalHeading>구독 추가</ModalHeading>
        </ModalNavigation>

        <ModalContent gap="20px">
          {/* 서비스명 */}
          <ModalContentItem flexDirection="column" gap="6px">
            <FormField flexDirection="column" gap="6px">
              <Typography
                variant="label1"
                weight="medium"
                color="semantic.label.normal"
                style={{ display: "block" }}
              >
                서비스명
              </Typography>
              <TextField
                placeholder="예: Netflix, Spotify"
                value={form.serviceName}
                onChange={(e) => {
                  setForm((f) => ({ ...f, serviceName: e.target.value }));
                  if (errors.serviceName) setErrors((p) => ({ ...p, serviceName: undefined }));
                }}
                invalid={!!errors.serviceName}
                width="100%"
              />
              {errors.serviceName && <FormErrorMessage>{errors.serviceName}</FormErrorMessage>}
            </FormField>
          </ModalContentItem>

          {/* 카테고리 */}
          <ModalContentItem flexDirection="column" gap="6px">
            <Typography
              variant="label1"
              weight="medium"
              color="semantic.label.normal"
              style={{ display: "block" }}
            >
              카테고리
            </Typography>
            <Select
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v as SubscribeCategory }))}
              width="100%"
            >
              {(Object.keys(CATEGORY_META) as SubscribeCategory[]).map((cat) => (
                <Option key={cat} value={cat}>
                  {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
                </Option>
              ))}
            </Select>
          </ModalContentItem>

          {/* 금액 */}
          <ModalContentItem flexDirection="column" gap="6px">
            <FormField flexDirection="column" gap="6px">
              <Typography
                variant="label1"
                weight="medium"
                color="semantic.label.normal"
                style={{ display: "block" }}
              >
                금액 (원)
              </Typography>
              <TextField
                type="number"
                placeholder="예: 13900"
                value={form.price === 0 ? "" : String(form.price)}
                onChange={(e) => {
                  setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }));
                  if (errors.price) setErrors((p) => ({ ...p, price: undefined }));
                }}
                invalid={!!errors.price}
                width="100%"
              />
              {errors.price && <FormErrorMessage>{errors.price}</FormErrorMessage>}
            </FormField>
          </ModalContentItem>

          {/* 결제 주기 */}
          <ModalContentItem flexDirection="column" gap="6px">
            <Typography
              variant="label1"
              weight="medium"
              color="semantic.label.normal"
              style={{ display: "block" }}
            >
              결제 주기
            </Typography>
            <Select
              value={form.billingCycle}
              onChange={(v) => {
                const cycle = v as BillingCycle;
                setForm((f) => ({
                  ...f,
                  billingCycle: cycle,
                  billingMonth: cycle === "MONTHLY" ? null : (f.billingMonth ?? 1),
                }));
              }}
              width="100%"
            >
              {(Object.keys(BILLING_CYCLE_META) as BillingCycle[]).map((cycle) => (
                <Option key={cycle} value={cycle}>
                  {BILLING_CYCLE_META[cycle].label}
                </Option>
              ))}
            </Select>
          </ModalContentItem>

          {/* 결제 월 (연간만) + 결제일 */}
          <ModalContentItem gap="12px" alignItems="flex-start">
            {form.billingCycle === "YEARLY" && (
              <FormField flexDirection="column" gap="6px" style={{ flex: 1 }}>
                <Typography
                  variant="label1"
                  weight="medium"
                  color="semantic.label.normal"
                  style={{ display: "block" }}
                >
                  결제 월
                </Typography>
                <Select
                  value={String(form.billingMonth ?? 1)}
                  onChange={(v) => {
                    setForm((f) => ({ ...f, billingMonth: Number(v) }));
                    if (errors.billingMonth) setErrors((p) => ({ ...p, billingMonth: undefined }));
                  }}
                  width="100%"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <Option key={m} value={String(m)}>
                      {m}월
                    </Option>
                  ))}
                </Select>
                {errors.billingMonth && <FormErrorMessage>{errors.billingMonth}</FormErrorMessage>}
              </FormField>
            )}

            <FormField flexDirection="column" gap="6px" style={{ flex: 1 }}>
              <Typography
                variant="label1"
                weight="medium"
                color="semantic.label.normal"
                style={{ display: "block" }}
              >
                결제일
              </Typography>
              <Select
                value={String(form.billingDay)}
                onChange={(v) => setForm((f) => ({ ...f, billingDay: Number(v) }))}
                width="100%"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <Option key={d} value={String(d)}>
                    {d}일
                  </Option>
                ))}
              </Select>
            </FormField>
          </ModalContentItem>

          {/* 결제 수단 */}
          <ModalContentItem flexDirection="column" gap="6px">
            <Typography
              variant="label1"
              weight="medium"
              color="semantic.label.normal"
              style={{ display: "block" }}
            >
              결제 수단
            </Typography>
            <Select
              value={form.paymentMethod}
              onChange={(v) => setForm((f) => ({ ...f, paymentMethod: v as PaymentMethod }))}
              width="100%"
            >
              {(Object.keys(PAYMENT_METHOD_META) as PaymentMethod[]).map((pm) => (
                <Option key={pm} value={pm}>
                  {PAYMENT_METHOD_META[pm].label}
                </Option>
              ))}
            </Select>
          </ModalContentItem>
        </ModalContent>

        <div
          style={{
            padding: "16px 20px 20px",
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
            borderTop: "1px solid var(--semantic-line-solid-normal)",
          }}
        >
          <Button variant="outlined" color="assistive" size="medium" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="solid"
            color="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "등록 중..." : "등록하기"}
          </Button>
        </div>
      </ModalContainer>
    </Modal>
  );
}
