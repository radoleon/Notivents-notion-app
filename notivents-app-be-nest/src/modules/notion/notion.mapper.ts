import { Injectable } from '@nestjs/common'
import { NotionDatabaseDto } from 'src/dtos/notion/NotionDatabaseDto'
import { NotionPageDto } from 'src/dtos/notion/NotionPageDto'
import { NotionPropertyDto } from 'src/dtos/notion/NotionPropertyDto'

@Injectable()
export class NotionMapper {
  constructor() {}

  public notionDatabasesToResponse(notionDatabases: any): NotionDatabaseDto[] {
    const result: NotionDatabaseDto[] = []

    for (let x of notionDatabases) {
      const notionProperties: NotionPropertyDto[] = []

      for (let y of Object.values(x.properties) as any[]) {
        if (y.type === 'date')
          notionProperties.push({
            notion_property_id: y.id,
            title: y.name
          })
      }

      const title = x.title.map((z: any) => z.plain_text).join('') || null
      const icon = (x.icon?.emoji ? x.icon?.emoji : x.icon?.external?.url) || null

      result.push({
        notion_database_id: x.id,
        url: x.url,
        title,
        icon,
        date_properties: notionProperties
      })
    }

    return result
  }

  public notionPagesToResponse(notionPages: any, datePropertyId: string): NotionPageDto[] {
    const result: NotionPageDto[] = []

    for (let x of notionPages) {
      const pageProperties = Object.values(x.properties) as any[]

      const titleProperty = pageProperties.find((y: any) => y.id === 'title')
      const title = titleProperty.map((y: any) => y.plain_text).join('') || null

      const dateProperty = pageProperties.find((x: any) => x.id === datePropertyId)

      result.push({
        id: x.id,
        url: x.url,
        title,
        date_start: dateProperty.start,
        date_end: dateProperty.end
      })
    }

    return result
  }
}
