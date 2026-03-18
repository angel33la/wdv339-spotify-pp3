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
          borderRadius: 0,
          lineWidth: 2,
          colorPrimary: "#00BCD4",
          colorText: "#FFFFFF",
          colorTextSecondary: "rgba(176, 190, 197, 0.9)",
          colorTextHeading: "#FFFFFF",
          colorBgContainer: "#0a0a0a",
          colorBgElevated: "#121212",
          controlHeightSM: 26,
          controlHeight: 34,
        },
        components: {
          Typography: {
            titleMarginBottom: 0,
            titleMarginTop: 0,
          },
          Input: {
            colorBorder: "#00BCD4",
            colorTextPlaceholder: "rgba(144, 164, 174, 0.8)",
          },
          Select: {
            colorBorder: "#00BCD4",
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
