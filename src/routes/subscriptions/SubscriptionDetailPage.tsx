import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Skeleton,
  Switch,
  ContentBadge,
  TextField,
  Select,
  Option,
  FormField,
  FormErrorMessage,
  Modal,
  ModalContainer,
  ModalNavigation,
  ModalClose,
  ModalContent,
  ModalContentItem,
  ModalHeading,
  useToast,
} from "@wanteddev/wds";
import { IconArrowLeft } from "@wanteddev/wds-icon";
import AppLayout from "../../layouts/AppLayout";
import {
  getSubscriptionById,
  editSubscription,
  deleteSubscription,
  changeSubscribeStatus,
} from "../../api/subscribe";
import {
  CATEGORY_META,
  BILLING_CYCLE_META,
  SUBSCRIBE_STATUS_META,
  PAYMENT_METHOD_META,
} from "../../type/subscribe";
import type {
  Subscription,
  SubscriptionDetail,
  SubscribeCategory,
  BillingCycle,
  PaymentMethod,
} from "../../type/subscribe";
import {
  formatKRW,
  getNextBillingDate,
  getDaysUntil,
  getDDayLabel,
} from "../../utils/format";

type FormErrors = Partial<Record<keyof Subscription, string>>;

function toBody(sub: SubscriptionDetail): Subscription {
  return {
    serviceName: sub.serviceName,
    category: sub.category,
    price: sub.price,
    billingCycle: sub.billingCycle,
    billingDay: sub.billingDay,
    billingMonth: sub.billingMonth,
    paymentMethod: sub.paymentMethod,
  };
}

export default function SubscriptionDetailPage() {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [sub, setSub] = useState<SubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Subscription>({
    serviceName: "",
    category: "OTT",
    price: 0,
    billingCycle: "MONTHLY",
    billingDay: 1,
    billingMonth: null,
    paymentMethod: "CARD",
  });
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  useEffect(() => {
    if (!subscriptionId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSubscriptionById(subscriptionId)
      .then((res) => {
        if (cancelled) return;
        setSub(res.data);
        setEditForm(toBody(res.data));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("구독 정보를 불러오는 데 실패했습니다.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subscriptionId, retryCount]);

  const handleToggleStatus = async () => {
    if (!sub || togglingStatus) return;
    const newStatus = sub.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    setSub((prev) => (prev ? { ...prev, status: newStatus } : prev));
    setTogglingStatus(true);
    try {
      await changeSubscribeStatus({ subscriptionId: String(sub.id), status: newStatus });
      toast({
        content:
          newStatus === "ACTIVE"
            ? "구독이 활성화되었습니다."
            : "구독이 일시정지되었습니다.",
        variant: "positive",
        duration: "short",
      });
    } catch {
      setSub((prev) => (prev ? { ...prev, status: sub.status } : prev));
      toast({ content: "상태 변경에 실패했습니다.", variant: "negative", duration: "short" });
    } finally {
      setTogglingStatus(false);
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!editForm.serviceName.trim()) errs.serviceName = "서비스명을 입력하세요.";
    if (!editForm.price || editForm.price <= 0) errs.price = "금액을 입력하세요.";
    if (
      editForm.billingCycle === "YEARLY" &&
      (!editForm.billingMonth || editForm.billingMonth < 1)
    ) {
      errs.billingMonth = "결제 월을 선택하세요.";
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }
    setSaving(true);
    try {
      const payload: Subscription = {
        ...editForm,
        billingMonth: editForm.billingCycle === "MONTHLY" ? null : editForm.billingMonth,
      };
      await editSubscription({ subscriptionId: String(sub!.id), data: payload });
      setSub((prev) => (prev ? { ...prev, ...payload } : prev));
      setIsEditing(false);
      setEditErrors({});
      toast({ content: "구독 정보가 수정되었습니다.", variant: "positive", duration: "short" });
    } catch {
      toast({
        content: "수정에 실패했습니다. 다시 시도해주세요.",
        variant: "negative",
        duration: "short",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!sub) return;
    setEditForm(toBody(sub));
    setEditErrors({});
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!sub || deleting) return;
    setDeleting(true);
    try {
      await deleteSubscription(String(sub.id));
      toast({
        content: `${sub.serviceName} 구독이 삭제되었습니다.`,
        variant: "positive",
        duration: "short",
      });
      navigate(-1);
    } catch {
      toast({
        content: "삭제에 실패했습니다. 다시 시도해주세요.",
        variant: "negative",
        duration: "short",
      });
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Derived values
  const nextBillingDate = sub
    ? getNextBillingDate(sub.billingDay, sub.billingCycle, sub.billingMonth)
    : null;
  const daysUntil = nextBillingDate ? getDaysUntil(nextBillingDate) : null;
  const isUpcoming = daysUntil !== null && daysUntil >= 0 && daysUntil <= 7;
  const yearlyExpense = sub
    ? sub.billingCycle === "MONTHLY"
      ? sub.price * 12
      : sub.price
    : null;
  const billingDayLabel = sub
    ? sub.billingCycle === "YEARLY"
      ? `${sub.billingMonth}월 ${sub.billingDay}일`
      : `매월 ${sub.billingDay}일`
    : null;
  const meta = sub ? CATEGORY_META[sub.category] : null;

  return (
    <AppLayout>
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            marginBottom: "20px",
            color: "#64748d",
            fontSize: "14px",
            fontFamily: "Pretendard, sans-serif",
            fontWeight: "500",
          }}
        >
          <IconArrowLeft width={16} height={16} />
          목록으로
        </button>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Skeleton variant="rectangle" width="100%" height={180} radius="16px" />
            <Skeleton variant="rectangle" width="100%" height={220} radius="16px" />
            <Skeleton variant="rectangle" width="100%" height={80} radius="16px" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <Typography
              variant="body2"
              color="semantic.label.alternative"
              style={{ display: "block", marginBottom: "12px" }}
            >
              {error}
            </Typography>
            <Button
              variant="outlined"
              color="assistive"
              size="medium"
              onClick={() => setRetryCount((c) => c + 1)}
            >
              다시 시도
            </Button>
          </div>
        )}

        {!loading && !error && sub && (
          <>
            {isEditing ? (
              <EditForm
                form={editForm}
                setForm={setEditForm}
                errors={editErrors}
                setErrors={setEditErrors}
                saving={saving}
                onSave={handleSave}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {/* ── Hero Card ── */}
                <div style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "16px",
                    }}
                  >
                    <ContentBadge
                      size="small"
                      color={sub.status === "ACTIVE" ? "accent" : "neutral"}
                    >
                      {SUBSCRIBE_STATUS_META[sub.status].label}
                    </ContentBadge>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                    {/* Service avatar */}
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "16px",
                        flexShrink: 0,
                        background:
                          "linear-gradient(135deg, rgba(0,102,255,0.15), rgba(77,148,255,0.25))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        fontWeight: "800",
                        color: "#0066FF",
                      }}
                    >
                      {sub.serviceName.charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Service name + category pill */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginBottom: "6px",
                        }}
                      >
                        <Typography
                          variant="title3"
                          weight="bold"
                          color="semantic.label.normal"
                        >
                          {sub.serviceName}
                        </Typography>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#0066FF",
                            backgroundColor: "rgba(0,102,255,0.08)",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontFamily: "Pretendard, sans-serif",
                          }}
                        >
                          {meta!.emoji} {meta!.label}
                        </span>
                      </div>

                      {/* Price */}
                      <p
                        style={{
                          margin: "0 0 14px",
                          fontSize: "32px",
                          fontWeight: "800",
                          color: "#0066FF",
                          fontFeatureSettings: '"tnum"',
                          letterSpacing: "-0.5px",
                          lineHeight: 1.1,
                        }}
                      >
                        {formatKRW(sub.price)}
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: "400",
                            color: "#64748d",
                            marginLeft: "5px",
                          }}
                        >
                          / {sub.billingCycle === "MONTHLY" ? "월" : "연"}
                        </span>
                      </p>

                      {/* Next billing */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Typography variant="body2" color="semantic.label.alternative">
                          다음 결제
                        </Typography>
                        <Typography
                          variant="body2"
                          weight="medium"
                          color="semantic.label.normal"
                        >
                          {nextBillingDate}
                        </Typography>
                        {isUpcoming && daysUntil !== null && (
                          <ContentBadge size="xsmall" color="accent">
                            {getDDayLabel(nextBillingDate!)}
                          </ContentBadge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Payment Info Card ── */}
                <div style={{ ...cardStyle, marginBottom: "16px" }}>
                  <Typography
                    variant="label1"
                    weight="bold"
                    color="semantic.label.normal"
                    style={{ display: "block", marginBottom: "4px" }}
                  >
                    결제 정보
                  </Typography>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                    }}
                  >
                    <InfoRow label="결제 주기" value={BILLING_CYCLE_META[sub.billingCycle].label} />
                    <InfoRow label="결제일" value={billingDayLabel!} />
                    <InfoRow
                      label="결제 수단"
                      value={PAYMENT_METHOD_META[sub.paymentMethod].label}
                    />
                    <InfoRow label="연간 지출" value={formatKRW(yearlyExpense!)} highlight />
                    <InfoRow
                      label="등록일"
                      value={new Date(sub.createdAt).toLocaleDateString("ko-KR")}
                    />
                    <InfoRow
                      label="최근 수정"
                      value={new Date(sub.updatedAt).toLocaleDateString("ko-KR")}
                    />
                  </div>
                </div>

                {/* ── Action Area ── */}
                <div
                  style={{
                    ...cardStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Switch
                      checked={sub.status === "ACTIVE"}
                      onCheckedChange={handleToggleStatus}
                      disabled={togglingStatus}
                      size="small"
                    />
                    <Typography variant="body2" color="semantic.label.normal">
                      {sub.status === "ACTIVE" ? "활성 상태" : "일시정지 상태"}
                    </Typography>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      variant="outlined"
                      color="assistive"
                      size="medium"
                      onClick={() => setIsEditing(true)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outlined"
                      color="assistive"
                      size="medium"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Delete Confirm Modal ── */}
        <Modal
          open={showDeleteModal}
          onOpenChange={(v) => !v && !deleting && setShowDeleteModal(false)}
        >
          <ModalContainer size="small">
            <ModalNavigation trailingContent={<ModalClose />}>
              <ModalHeading>구독 삭제</ModalHeading>
            </ModalNavigation>
            <ModalContent gap="8px">
              <ModalContentItem flexDirection="column" gap="6px">
                <Typography variant="body1" weight="medium" color="semantic.label.normal">
                  {sub?.serviceName} 구독을 삭제하시겠습니까?
                </Typography>
                <Typography variant="body2" color="semantic.label.alternative">
                  삭제된 구독은 복구할 수 없습니다.
                </Typography>
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
              <Button
                variant="outlined"
                color="assistive"
                size="medium"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                취소
              </Button>
              <Button
                variant="solid"
                color="assistive"
                size="medium"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "삭제 중..." : "삭제하기"}
              </Button>
            </div>
          </ModalContainer>
        </Modal>
      </main>
    </AppLayout>
  );
}

/* ── Shared card style ── */
const cardStyle: React.CSSProperties = {
  borderRadius: "16px",
  backgroundColor: "var(--semantic-background-normal-normal)",
  border: "1px solid #e3e8ee",
  boxShadow: "rgba(0,55,112,0.08) 0 2px 8px",
  padding: "24px 28px",
  marginBottom: "16px",
};

/* ── InfoRow ── */
function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #f0f4f8" }}>
      <Typography
        variant="caption1"
        color="semantic.label.alternative"
        style={{ display: "block", marginBottom: "3px" }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        weight="medium"
        color="semantic.label.normal"
        style={{
          display: "block",
          color: highlight ? "#0066FF" : undefined,
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value}
      </Typography>
    </div>
  );
}

/* ── EditForm ── */
interface EditFormProps {
  form: Subscription;
  setForm: React.Dispatch<React.SetStateAction<Subscription>>;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

function EditForm({
  form,
  setForm,
  errors,
  setErrors,
  saving,
  onSave,
  onCancel,
}: EditFormProps) {
  return (
    <div
      style={{
        borderRadius: "16px",
        backgroundColor: "var(--semantic-background-normal-normal)",
        border: "1px solid #e3e8ee",
        boxShadow: "rgba(0,55,112,0.08) 0 2px 8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 28px",
          borderBottom: "1px solid #e3e8ee",
          background:
            "linear-gradient(135deg, rgba(0,102,255,0.03), rgba(77,148,255,0.05))",
        }}
      >
        <Typography variant="label1" weight="bold" color="semantic.label.normal">
          구독 정보 수정
        </Typography>
      </div>

      <div
        style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* 서비스명 + 카테고리 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
            {errors.serviceName && (
              <FormErrorMessage>{errors.serviceName}</FormErrorMessage>
            )}
          </FormField>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
          </div>
        </div>

        {/* 금액 + 결제 주기 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
          </div>
        </div>

        {/* 결제 월(연간) + 결제일 + 결제 수단 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              form.billingCycle === "YEARLY" ? "1fr 1fr 1fr" : "1fr 1fr",
            gap: "16px",
          }}
        >
          {form.billingCycle === "YEARLY" && (
            <FormField flexDirection="column" gap="6px">
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
                  if (errors.billingMonth)
                    setErrors((p) => ({ ...p, billingMonth: undefined }));
                }}
                width="100%"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <Option key={m} value={String(m)}>
                    {m}월
                  </Option>
                ))}
              </Select>
              {errors.billingMonth && (
                <FormErrorMessage>{errors.billingMonth}</FormErrorMessage>
              )}
            </FormField>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
              onChange={(v) =>
                setForm((f) => ({ ...f, paymentMethod: v as PaymentMethod }))
              }
              width="100%"
            >
              {(Object.keys(PAYMENT_METHOD_META) as PaymentMethod[]).map((pm) => (
                <Option key={pm} value={pm}>
                  {PAYMENT_METHOD_META[pm].label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div
        style={{
          padding: "16px 28px 24px",
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          borderTop: "1px solid #f0f4f8",
        }}
      >
        <Button
          variant="outlined"
          color="assistive"
          size="medium"
          onClick={onCancel}
          disabled={saving}
        >
          취소
        </Button>
        <Button
          variant="solid"
          color="primary"
          size="medium"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </div>
  );
}
