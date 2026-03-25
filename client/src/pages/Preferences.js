import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Slider,
  Switch,
  Typography,
  message,
} from "antd";
import {
  applyThemeFromPreferences,
  loadPreferences,
  savePreferences,
} from "../utils/preferences";

const genreOptions = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "R&B",
  "Country",
  "Electronic",
  "Jazz",
  "Classical",
  "Lo-fi",
  "Indie",
  "Metal",
  "Reggae",
  "Blues",
  "Folk",
  "Oldies",
].map((genre) => ({ value: genre, label: genre }));

export default function Preferences() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const prefs = loadPreferences();
    form.setFieldsValue({
      themeMode: prefs.themeMode,
      favoriteGenres: prefs.favoriteGenres,
      favoriteArtists: prefs.favoriteArtists.join(", "),
      allowExplicit: prefs.allowExplicit,
      recommendationStrength: prefs.recommendationStrength,
      prioritizeRecentlyPlayed: prefs.prioritizeRecentlyPlayed,
      profileTagline: prefs.profileTagline,
    });
  }, [form]);

  const handleSave = async (values) => {
    try {
      setSaving(true);
      const favoriteArtists = String(values.favoriteArtists || "")
        .split(",")
        .map((artist) => artist.trim())
        .filter(Boolean);

      savePreferences({
        themeMode: values.themeMode,
        favoriteGenres: values.favoriteGenres || [],
        favoriteArtists,
        allowExplicit: values.allowExplicit,
        recommendationStrength: values.recommendationStrength,
        prioritizeRecentlyPlayed: values.prioritizeRecentlyPlayed,
        profileTagline: values.profileTagline,
      });

      applyThemeFromPreferences();
      messageApi.success("Preferences saved.");
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (value) => {
    document.body.setAttribute("data-theme", value);
    document.documentElement.setAttribute("data-theme", value);
  };

  return (
    <div className="playlistsPage">
      {contextHolder}
      <Typography.Title level={1} className="playlistsTitle">
        Preferences
      </Typography.Title>

      <div
        className="createPlaylistCard"
        style={{ width: "min(900px, 92vw)" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            themeMode: "dark",
            allowExplicit: true,
            recommendationStrength: 60,
            prioritizeRecentlyPlayed: true,
          }}
        >
          <Form.Item label="Theme Mode" name="themeMode">
            <Select
              onChange={handleThemeChange}
              options={[
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Favorite Genres" name="favoriteGenres">
            <Select
              mode="multiple"
              options={genreOptions}
              placeholder="Select genres"
            />
          </Form.Item>

          <Form.Item
            label="Favorite Artists"
            name="favoriteArtists"
            extra="Enter artist names separated by commas"
          >
            <Input placeholder="e.g. Drake, Billie Eilish, The Weeknd" />
          </Form.Item>

          <Form.Item label="Profile Tagline" name="profileTagline">
            <Input
              placeholder="A short profile line for your music taste"
              maxLength={120}
            />
          </Form.Item>

          <Form.Item
            label="Allow Explicit Content"
            name="allowExplicit"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Prioritize Recently Played"
            name="prioritizeRecentlyPlayed"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Recommendation Tuning"
            name="recommendationStrength"
            extra="Higher means stronger focus on your saved/queued preferences"
          >
            <Slider min={0} max={100} />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={saving}>
            Save Preferences
          </Button>
        </Form>
      </div>
    </div>
  );
}
