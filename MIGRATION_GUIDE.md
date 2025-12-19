# Database Migration Guide

This guide explains how to migrate from hardcoded content to the new CMS database.

## Prerequisites

- PostgreSQL database
- Node.js and npm installed
- Environment variables configured

## Step-by-Step Migration

### 1. Set Up Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
```

Replace:
- `username`: Your PostgreSQL username
- `password`: Your PostgreSQL password
- `localhost:5432`: Your database host and port
- `database_name`: Your database name

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma client with the new CMS models.

### 3. Create Database Migration

```bash
npx prisma migrate dev --name add_cms_models
```

This creates a new migration file and applies it to your database. The migration will:
- Create `HeroSection` table
- Create `AboutSection` table
- Create `ContactSection` table
- Create `FooterSection` table
- Create `SocialLink` table

### 4. Verify Migration

Check that the tables were created:

```bash
npx prisma studio
```

This opens Prisma Studio where you can view your database tables.

### 5. Seed Initial Data

Run the seed script to populate the database with current hardcoded content:

```bash
npm run prisma:seed
```

The seed script will create:
- One HeroSection record (id: "hero_singleton")
- One AboutSection record (id: "about_singleton")
- One ContactSection record (id: "contact_singleton")
- One FooterSection record (id: "footer_singleton")
- Two SocialLink records (Instagram and LinkedIn)

### 6. Verify Seeded Data

Check Prisma Studio again to verify the data was seeded correctly:

```bash
npx prisma studio
```

You should see one record in each section table with the default values from the seed file.

### 7. Test the Application

Start the development server:

```bash
npm run dev
```

Navigate to:
- **Public site**: http://localhost:3000 - Should display content from database
- **Admin panel**: http://localhost:3000/admin - Should allow editing content

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Add Database**:
   - Use Vercel Postgres or connect to external PostgreSQL

2. **Set Environment Variables**:
   - Add `DATABASE_URL` in Vercel dashboard

3. **Run Migrations**:
   - Migrations run automatically during build
   - Or run manually: `npx prisma migrate deploy`

4. **Seed Data**:
   - Run seed script once after first deployment
   - Can use a one-time migration script or run manually

### Option 2: Custom Server

1. **Deploy Database**:
   - Set up PostgreSQL on your server

2. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Seed Data**:
   ```bash
   npm run prisma:seed
   ```

4. **Build Application**:
   ```bash
   npm run build
   npm start
   ```

## Rollback (If Needed)

If something goes wrong and you need to rollback:

### Rollback Last Migration

```bash
npx prisma migrate dev --name revert_cms_models
```

Then manually remove the new tables or restore from backup.

### Restore Hardcoded Content

If you need to temporarily revert to hardcoded content:

1. Checkout the previous commit:
   ```bash
   git checkout <previous-commit-hash>
   ```

2. Or manually revert the component changes to use hardcoded values

## Troubleshooting

### Migration Fails

**Error**: "Table already exists"

**Solution**: Drop the existing tables or use `npx prisma migrate reset` (WARNING: This deletes all data)

```bash
npx prisma migrate reset
```

### Seed Script Fails

**Error**: "Unique constraint violation"

**Solution**: The seed data already exists. Update the seed script to use `upsert` instead of `create`, or manually delete the existing records:

```bash
npx prisma studio
# Delete records from each table
# Run seed script again
npm run prisma:seed
```

### Connection Errors

**Error**: "Can't reach database server"

**Solution**: Check your `DATABASE_URL`:
- Ensure PostgreSQL is running
- Verify hostname, port, username, and password
- Check firewall settings
- Test connection with `psql` command line tool

### Type Errors After Migration

**Error**: "Property 'heroSection' does not exist"

**Solution**: Regenerate Prisma client:

```bash
npx prisma generate
```

## Backup Strategy

Before running migrations in production:

1. **Backup Database**:
   ```bash
   pg_dump -U username database_name > backup.sql
   ```

2. **Test on Staging** first

3. **Have Rollback Plan** ready

## Post-Migration Checklist

- [ ] Verify all tables created successfully
- [ ] Verify seed data inserted correctly
- [ ] Test public site displays content
- [ ] Test admin panel allows editing
- [ ] Test all CRUD operations
- [ ] Verify data persists after page refresh
- [ ] Test error handling (invalid inputs)
- [ ] Check database indexes are created
- [ ] Monitor database performance
- [ ] Set up database backups

## Data Validation

After migration, validate the data:

1. **Hero Section**:
   - Check name displays correctly
   - Check badges show properly
   - Check button labels are correct

2. **About Section**:
   - Check all 3 paragraphs display
   - Check statistics show correctly
   - Check CTA buttons work

3. **Contact Section**:
   - Check email is correct
   - Check location displays
   - Check Calendly link works (if set)

4. **Footer Section**:
   - Check social links display
   - Check links are clickable
   - Check visibility toggles work

## Monitoring

After deployment, monitor:

1. **Database Performance**:
   - Query execution time
   - Connection pool usage
   - Database size

2. **Application Logs**:
   - API route errors
   - Validation errors
   - Database connection errors

3. **User Experience**:
   - Page load times
   - Admin panel responsiveness
   - Form submission success rate

## Support

If you encounter issues:

1. Check application logs
2. Check database logs
3. Verify environment variables
4. Review Prisma documentation
5. Check Next.js documentation

## Additional Resources

- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
