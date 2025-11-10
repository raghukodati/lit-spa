/**
 * Category Model - Product Category Entity
 */

export class Category {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.slug = data.slug || '';
    this.description = data.description || '';
    this.parentId = data.parentId || null;
    this.image = data.image || '';
    this.icon = data.icon || '';
    this.order = data.order || 0;
    this.productCount = data.productCount || 0;
    this.status = data.status || 'active'; // active, inactive
    this.metaTitle = data.metaTitle || '';
    this.metaDescription = data.metaDescription || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Validate category
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Category name is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate slug from name
   */
  generateSlug() {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return this.slug;
  }

  /**
   * Check if has parent
   */
  hasParent() {
    return this.parentId !== null;
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      parentId: this.parentId,
      image: this.image,
      icon: this.icon,
      order: this.order,
      productCount: this.productCount,
      status: this.status,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create from API response
   */
  static fromAPI(data) {
    return new Category(data);
  }
}

export default Category;
