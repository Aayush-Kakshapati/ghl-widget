import { useWidgetStore } from "../store/widgetStore";


function SettingsPanel() {

    const settings = useWidgetStore(
        (state) => state.settings
    );


    const updateSetting = useWidgetStore(
        (state) => state.updateSetting
    );


    const updateColor = useWidgetStore(
        (state) => state.updateColor
    );


    return (

        <div>
            <h2>
                Widget Settings
            </h2>

            <label>
                Announcement Message
            </label>

            <input
                value={settings.message}
                onChange={(e) =>
                    updateSetting(
                        "message",
                        e.target.value
                    )
                }
            />

            <label>
                Button Text
            </label>

            <input
                value={settings.buttonText}
                onChange={(e) =>
                    updateSetting(
                        "buttonText",
                        e.target.value
                    )
                }
            />
            <label>
                Button URL
            </label>

            <input
                value={settings.buttonUrl}
                onChange={(e) =>
                    updateSetting(
                        "buttonUrl",
                        e.target.value
                    )
                }
            />

            <label>

                <input
                    type="checkbox"
                    checked={settings.showButton}
                    onChange={(e) =>
                        updateSetting(
                            "showButton",
                            e.target.checked
                        )
                    }

                />

                Show Button
            </label>
            <hr />

            <h3>
                Colors
            </h3>

            <label>
                Background Color
            </label>

            <input
                type="color"
                value={
                    settings.colors.background
                }
                onChange={(e) =>
                    updateColor(
                        "background",
                        e.target.value
                    )
                }
            />

            <label>
                Text Color
            </label>

            <input
                type="color"
                value={
                    settings.colors.text
                }
                onChange={(e) =>
                    updateColor(
                        "text",
                        e.target.value
                    )
                }
            />

            <label>
                Button Color
            </label>

            <input
                type="color"
                value={
                    settings.colors.button
                }
                onChange={(e) =>
                    updateColor(
                        "button",
                        e.target.value
                    )
                }
            />
        </div>
    );
}

export default SettingsPanel;