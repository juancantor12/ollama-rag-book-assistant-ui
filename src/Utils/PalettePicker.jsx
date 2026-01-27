import React, { useEffect, useState } from 'react'
import { palettes, theme1Palettes } from './palettes.jsx'

const themes = [
    { id: "classic", label: "Classic", bodyClass: "" },
    { id: "theme-1", label: "Studio", bodyClass: "theme-1" }
]

const PalettePicker = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [activeTheme, setActiveTheme] = useState("classic")
    const [activePalette, setActivePalette] = useState("")

    const hexToRgba = (hex, alpha) => {
        const cleaned = hex.replace("#", "")
        const size = cleaned.length === 3 ? 1 : 2
        const parts = cleaned.match(new RegExp(`.{1,${size}}`, "g")) || []
        const [r, g, b] = parts.map((part) =>
            parseInt(size === 1 ? part + part : part, 16)
        )
        if ([r, g, b].some((v) => Number.isNaN(v))) {
            return "rgba(0,0,0,0)"
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    const applyTheme = (themeId) => {
        const theme = themes.find((t) => t.id === themeId) || themes[0]
        document.body.classList.remove("theme-1")
        if (theme.bodyClass) {
            document.body.classList.add(theme.bodyClass)
        }
        localStorage.setItem("ui_theme", theme.id)
        setActiveTheme(theme.id)
        const paletteKey = theme.id === "theme-1" ? "ui_palette_theme1" : "ui_palette_classic"
        const storedPalette = localStorage.getItem(paletteKey)
        if (storedPalette) {
            try {
                const parsed = JSON.parse(storedPalette)
                updateColors(parsed)
                setActivePalette(JSON.stringify(parsed))
            } catch {
                localStorage.removeItem(paletteKey)
            }
        } else {
            const fallback = theme.id === "theme-1" ? theme1Palettes[0] : palettes[0]
            updateColors(fallback)
            setActivePalette(JSON.stringify(fallback))
        }
    }

    const updateColors = (colors) => {
        const root = document.documentElement
        const target = document.body
        const hasAccentPalette = colors.length >= 7
        const accent = hasAccentPalette ? colors[4] : colors[1]
        const accent2 = hasAccentPalette ? colors[5] : colors[0]
        const accent3 = hasAccentPalette ? colors[6] : colors[2]
        const accentSoft = hexToRgba(accent, 0.25)
        const accent2Soft = hexToRgba(accent2, 0.22)
        const accent3Soft = hexToRgba(accent3, 0.3)

        const baseVars = [
            ["--dark", colors[0]],
            ["--medium-dark", colors[1]],
            ["--light-medium", colors[2]],
            ["--lightest", colors[3]]
        ]
        baseVars.forEach(([name, value]) => {
            root.style.setProperty(name, value)
            target.style.setProperty(name, value)
        })

        const accentVars = [
            ["--accent", accent],
            ["--accent-2", accent2],
            ["--accent-3", accent3],
            ["--accent-soft", accentSoft],
            ["--accent-2-soft", accent2Soft],
            ["--accent-3-soft", accent3Soft]
        ]
        accentVars.forEach(([name, value]) => {
            root.style.setProperty(name, value)
            target.style.setProperty(name, value)
        })
    }

    const handlePaletteSelect = (colors) => {
        updateColors(colors)
        const storageKey = activeTheme === "theme-1" ? "ui_palette_theme1" : "ui_palette_classic"
        localStorage.setItem(storageKey, JSON.stringify(colors))
        setActivePalette(JSON.stringify(colors))
        setIsPopupOpen(false)
    }

    useEffect(() => {
        const storedTheme = localStorage.getItem("ui_theme")
        if (storedTheme) {
            applyTheme(storedTheme)
        } else {
            applyTheme("classic")
        }
    }, [])

    const availablePalettes = activeTheme === "theme-1" ? theme1Palettes : palettes

    return (
        <div>
            <button onClick={() => setIsPopupOpen(true)}>Change theme</button>
            {isPopupOpen && (
                <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Select a Palette</h3>
                        <div className="theme-section">
                            <div className="theme-title">Themes</div>
                            <div className="theme-grid">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        className={`theme-option ${activeTheme === theme.id ? "active" : ""}`}
                                        onClick={() => applyTheme(theme.id)}
                                    >
                                        {theme.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="palettes-list card">
                            {availablePalettes.map((palette, index) => (
                                <div
                                    key={index}
                                    className={`palette-preview ${activePalette === JSON.stringify(palette) ? "active" : ""}`}
                                    onClick={() => handlePaletteSelect(palette)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '10px',
                                    }}
                                >
                                    {palette.map((color, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                backgroundColor: color,
                                                width: '15px',
                                                height: '45px',
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PalettePicker
