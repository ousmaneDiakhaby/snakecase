"use server"

import { db } from "@/db"
import { COLORS, MODELS } from "@/validators/option-validator"
import { PRODUCT_PRICES } from "@/config/products"

export type CaseColor = typeof COLORS[number]['value']
export type CaseFinish = keyof typeof PRODUCT_PRICES.finish
export type CaseMaterial = keyof typeof PRODUCT_PRICES.material
export type PhoneModel = typeof MODELS.options[number]['value']

export type SaveConfigArgs = {
    configId: string
    color: CaseColor
    finish: CaseFinish
    material: CaseMaterial
    model: PhoneModel
}

export async function saveConfig({
    configId,
    color,
    finish,
    material,
    model
}: SaveConfigArgs) {
    try {
        await db.configuration.update({
            where: { id: configId },
            data: {
                color,
                finish,
                material,
                model,
            },
        })
        
        return { success: true }
    } catch (error) {
        console.error('Error saving configuration:', error)
        return { 
            success: false, 
            error: 'Failed to save configuration' 
        }
    }
}
