import React, { useState } from 'react'
import { palettes } from './palettes.jsx'

const PalettePicker = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const updateColors = (colors) => {
        const root = document.documentElement
        root.style.setProperty('--dark', colors[0])
        root.style.setProperty('--medium-dark', colors[1])
        root.style.setProperty('--light-medium', colors[2])
        root.style.setProperty('--lightest', colors[3])
    }

    const handlePaletteSelect = (colors) => {
        updateColors(colors)
        setIsPopupOpen(false)
    }

    return (
        <div>
            <button onClick={() => setIsPopupOpen(true)}>Change theme</button>
            {isPopupOpen && (
                <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Select a Palette</h3>
                        <div className="palettes-list card">
                            {palettes.map((palette, index) => (
                                <div
                                    key={index}
                                    className="palette-preview"
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
