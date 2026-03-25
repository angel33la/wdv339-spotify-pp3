import { useMemo } from "react";
import { theme } from "antd";
import { createStyles } from "antd-style";
import clsx from "clsx";

const useStyles = createStyles(({ css, cssVar }) => {
  const lightBorder = {
    border: `${cssVar.lineWidth} solid ${cssVar.colorPrimary}`,
    boxShadow: `0 0 3px ${cssVar.colorPrimary}, inset 0 0 10px ${cssVar.colorPrimary}`,
  };

  return {
    lightBorder,
    app: css({
      textShadow: "0 0 5px color-mix(in srgb, currentColor 50%, transparent)",
    }),
    modalContainer: css({
      ...lightBorder,
      padding: 0,
    }),
    modalHeader: css({
      padding: `${cssVar.padding} ${cssVar.paddingLG}`,
      margin: 0,
      position: "relative",

      "&:after": {
        ...lightBorder,
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        border: 0,
        height: cssVar.lineWidth,
        background: cssVar.colorPrimary,
      },
    }),
    modalBody: css({
      padding: `${cssVar.padding} ${cssVar.paddingLG}`,
    }),
    modalFooter: css({
      padding: `${cssVar.padding} ${cssVar.paddingLG}`,
    }),

    buttonRoot: css({
      ...lightBorder,
      border: undefined,
      borderWidth: cssVar.lineWidth,
      borderColor: cssVar.colorPrimary,
    }),
    buttonRootSolid: css({
      color: cssVar.colorBgContainer,
      border: "none",
      fontWeight: "bolder",
    }),
    buttonRootSolidDanger: css({
      boxShadow: `0 0 5px ${cssVar.colorError}`,
    }),

    colorPickerBody: css({
      pointerEvents: "none",
    }),
    tooltipRoot: css({
      padding: cssVar.padding,
    }),
    tooltipContainer: css({
      ...lightBorder,
      color: cssVar.colorPrimary,
    }),
    progressTrack: css({
      backgroundColor: cssVar.colorPrimary,
    }),
  };
});

const useGeekTheme = () => {
  const { styles } = useStyles();

  return useMemo(
    () => ({
      theme: {
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#00f0ff",
          colorSuccess: "#39ff14",
          colorWarning: "#ffff00",
          colorError: "#ff0080",
          colorInfo: "#00f0ff",
          colorTextBase: "#ffffff",
          colorBgBase: "#0a0a0a",
          colorPrimaryBg: "#001a1a",
          colorPrimaryBgHover: "#003333",
          colorPrimaryBorder: "#00cccc",
          colorPrimaryBorderHover: "#00f0ff",
          colorPrimaryHover: "#33f3ff",
          colorPrimaryActive: "#00cccc",
          colorPrimaryText: "#00f0ff",
          colorPrimaryTextHover: "#33f3ff",
          colorPrimaryTextActive: "#00cccc",
          colorSuccessBg: "#002600",
          colorSuccessBgHover: "#003d00",
          colorSuccessBorder: "#39ff14",
          colorSuccessBorderHover: "#4fff33",
          colorSuccessHover: "#4fff33",
          colorSuccessActive: "#39ff14",
          colorSuccessText: "#39ff14",
          colorSuccessTextHover: "#4fff33",
          colorSuccessTextActive: "#39ff14",
          colorWarningBg: "#333300",
          colorWarningBgHover: "#4d4d00",
          colorWarningBorder: "#ffff00",
          colorWarningBorderHover: "#ffff33",
          colorWarningHover: "#ffff33",
          colorWarningActive: "#ffff00",
          colorWarningText: "#ffff00",
          colorWarningTextHover: "#ffff33",
          colorWarningTextActive: "#ffff00",
          colorErrorBg: "#33001a",
          colorErrorBgHover: "#4d0026",
          colorErrorBorder: "#ff0080",
          colorErrorBorderHover: "#ff3399",
          colorErrorHover: "#ff3399",
          colorErrorActive: "#ff0080",
          colorErrorText: "#ff0080",
          colorErrorTextHover: "#ff3399",
          colorErrorTextActive: "#ff0080",
          colorInfoBg: "#001a1a",
          colorInfoBgHover: "#003333",
          colorInfoBorder: "#00cccc",
          colorInfoBorderHover: "#00f0ff",
          colorInfoHover: "#33f3ff",
          colorInfoActive: "#00cccc",
          colorInfoText: "#00f0ff",
          colorInfoTextHover: "#33f3ff",
          colorInfoTextActive: "#00cccc",
          colorText: "#ffffff",
          colorTextSecondary: "#cccccc",
          colorTextTertiary: "#999999",
          colorTextQuaternary: "#666666",
          colorTextDisabled: "#333333",
          colorBgContainer: "#0a0a0a",
          colorBgElevated: "#1a1a1a",
          colorBgLayout: "#000000",
          colorBgSpotlight: "#00f0ff",
          colorBgMask: "rgba(0, 0, 0, 0.8)",
          colorBorder: "#333333",
          colorBorderSecondary: "#1a1a1a",
          borderRadius: 2,
          borderRadiusXS: 0,
          borderRadiusSM: 1,
          borderRadiusLG: 4,
          padding: 12,
          paddingSM: 8,
          paddingLG: 16,
          margin: 12,
          marginSM: 8,
          marginLG: 16,
          boxShadow: "0 0 8px #00f0ff",
          boxShadowSecondary: "0 0 16px #00f0ff",
          lineWidth: 2,
          colorLink: "#33f3ff",
          colorLinkHover: "#00f0ff",
          colorTextHeading: "#ffffff",
          controlHeightSM: 26,
          controlHeight: 34,
        },
        components: {
          Typography: {
            titleMarginBottom: 0,
            titleMarginTop: 0,
          },
          Input: {
            colorBorder: "#00cccc",
            activeBorderColor: "#00f0ff",
            hoverBorderColor: "#33f3ff",
            colorTextPlaceholder: "#666666",
          },
          Select: {
            colorBorder: "#00cccc",
            activeBorderColor: "#00f0ff",
            hoverBorderColor: "#33f3ff",
          },
        },
      },
      app: {
        className: styles.app,
      },
      modal: {
        classNames: {
          container: styles.modalContainer,
          header: styles.modalHeader,
          body: styles.modalBody,
          footer: styles.modalFooter,
        },
      },
      button: {
        classNames: {
          root: clsx(styles.buttonRoot),
        },
      },
      alert: {
        classNames: {
          message: "alert-message",
        },
      },
    }),
    [styles],
  );
};

export default useGeekTheme;
