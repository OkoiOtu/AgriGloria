// Lightweight products page functionality: load products, filters, currency, bulk calculator, comparison table.

document.addEventListener('DOMContentLoaded', () => {
  // --- Sample product data ---
  const products = [
    {
      id: 'layer-chicken',
      title: 'Layer Chicken (Point-of-lay)',
      category: 'poultry',
      priceNGN: 4500,
      priceUSD: 8.5,
      unit: 'per bird',
      stock: 120,
      featured: true,
      image: '../assets/gallery/Brown_Hen_Near_White_Egg_on_Nest.jpg',
      features: ['Vaccinated', 'High egg yield', 'Adapted to local climate'],
      description: 'Healthy point-of-lay layer chickens for egg production.'
    },
    {
      id: 'broiler-chicken',
      title: 'Broiler Chicken (Meat)',
      category: 'poultry',
      priceNGN: 2200,
      priceUSD: 4.2,
      unit: 'per bird',
      stock: 300,
      featured: false,
      image: '../assets/gallery/Close_Up_Shot_of_a_Broiler_Chicken.jpg',
      features: ['Fast-growing', 'High feed conversion', 'Antibiotic-free'],
      description: 'Premium broiler stock raised for meat.'
    },
    {
      id: 'pig',
      title: 'Weaner Pig',
      category: 'pigs',
      priceNGN: 35000,
      priceUSD: 66,
      unit: 'per pig',
      stock: 40,
      featured: false,
      image: '../assets/gallery/Piglets_at_Farm.jpg',
      features: ['Good breeding stock', 'Dewormed', 'Healthy'],
      description: 'Weaner pigs from quality breeds.'
    },
    {
      id: 'snail',
      title: 'Edible Snail (per dozen)',
      category: 'snails',
      priceNGN: 1200,
      priceUSD: 2.3,
      unit: 'per dozen',
      stock: 1000,
      featured: false,
      image: '../assets/gallery/Brown_Snail_on_Tree_Trunk.jpg',
      features: ['High protein', 'Export quality'],
      description: 'Fresh heliculture stock.'
    },
    {
      id: 'fish',
      title: 'Catfish (per kg)',
      category: 'fish',
      priceNGN: 900,
      priceUSD: 1.8,
      unit: 'per kg',
      stock: 2000,
      featured: false,
      image: '../assets/gallery/Bunch_of_Grey_Fish.jpg',
      features: ['Live delivery', 'Processed option'],
      description: 'Freshly harvested catfish and tilapia.'
    },
    {
      id: 'goat',
      title: 'Goat (Adult)',
      category: 'goats',
      priceNGN: 55000,
      priceUSD: 105,
      unit: 'per goat',
      stock: 25,
      featured: false,
      image: '../assets/gallery/Close_Up_Photo_of_a_Goat_Head.jpg',
      features: ['Dual purpose', 'Healthy breeding stock'],
      description: 'Adult goats suitable for meat and dairy.'
    }
  ];

  // --- State ---
  let currentCategory = 'all';
  let currency = 'NGN'; // 'NGN' or 'USD'
  const currencySymbols = { NGN: '₦', USD: '$' };

  // --- DOM ---
  const grid = document.getElementById('productsGrid');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const qtyBtns = document.querySelectorAll('.qty-btn');
  const productSelect = document.getElementById('productSelect');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const quantityInput = document.getElementById('quantityInput');
  const deliveryLocation = document.getElementById('deliveryLocation');
  const discountPercentEl = document.getElementById('discountPercent');
  const unitPriceEl = document.getElementById('unitPrice');
  const totalQuantityEl = document.getElementById('totalQuantity');
  const discountAmountEl = document.getElementById('discountAmount');
  const deliveryCostEl = document.getElementById('deliveryCost');
  const totalCostEl = document.getElementById('totalCost');
  const resetCalculatorBtn = document.getElementById('resetCalculator');
  const getQuoteBtn = document.getElementById('getQuoteBtn');
  const comparisonBody = document.getElementById('comparisonTable');
  const whatsappOrder = document.getElementById('whatsappOrder');

  // --- Helpers ---
  function formatPrice(value, cur = currency) {
    if (cur === 'NGN') return `${currencySymbols.NGN} ${Number(value).toLocaleString()}`;
    return `${currencySymbols.USD} ${Number(value).toFixed(2)}`;
  }

  function convertPrice(priceNGN) {
    if (currency === 'NGN') return priceNGN;
    const rate = 4200;
    return +(priceNGN / rate).toFixed(2);
  }

  // --- Animation setup (keyframes/style used by ripple) ---
  (function injectAnimationStyles() {
    const style = document.createElement('style');
    style.id = 'products-animations';
    style.textContent = `
      @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        transform: scale(0);
        animation: ripple-animation 700ms ease-out;
        pointer-events: none;
      }
      .btn-with-ripple { position: relative; overflow: hidden; }
      .stat-animate { transition: transform 600ms cubic-bezier(.2,.9,.2,1), opacity 600ms; transform: translateY(6px); opacity: 0; }
      .stat-animate.in-view { transform: translateY(0); opacity: 1; }
      .bulk-animate { transition: transform 700ms cubic-bezier(.2,.9,.2,1), opacity 700ms; transform: translateY(20px); opacity: 0; }
      .bulk-animate.in-view { transform: translateY(0); opacity: 1; }
      .product-card { will-change: transform, opacity; }
    `;
    document.head.appendChild(style);
  })();

  // --- Render Functions ---
  function renderProducts() {
    grid.innerHTML = '';
    const filtered = products.filter(p => currentCategory === 'all' ? true : p.category === currentCategory);
    if (filtered.length === 0) {
      grid.innerHTML = `<div class="loading-state no-results"><i class="fas fa-folder-open"></i><p>No products found for this category.</p></div>`;
      return;
    }

    filtered.forEach((p, idx) => {
      const price = currency === 'NGN' ? p.priceNGN : p.priceUSD || +(p.priceNGN / 4200).toFixed(2);
      const card = document.createElement('div');
      card.className = 'product-card';
      // set initial hidden state for reveal animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(18px)';
      card.dataset.index = idx;

      card.innerHTML = `
        ${p.featured ? `<div class="product-badge"><i class="fas fa-star"></i> Featured</div>` : ''}
        <div class="product-image"><img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.onerror=null;this.src='../assets/images/Agri_logo.png'"></div>
        <div class="product-content">
          <h3 class="product-title">${p.title}</h3>
          <p class="product-description">${p.description}</p>
          <div class="pricing-info">
            <div class="price-display">
              <div class="current-price">${formatPrice(price, currency)}</div>
              <div class="price-unit">${p.unit}</div>
            </div>
            <div class="stock-status ${p.stock > 50 ? 'in-stock' : p.stock > 0 ? 'low-stock' : 'out-of-stock'}">
              ${p.stock > 50 ? '<i class="fas fa-check-circle"></i> In stock' : p.stock > 0 ? '<i class="fas fa-exclamation-circle"></i> Low stock' : '<i class="fas fa-times-circle"></i> Out of stock'}
            </div>
          </div>
          <ul class="product-features">
            ${p.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
          </ul>
          <div class="product-actions">
            <a class="btn-order btn-with-ripple" href="mailto:sales@agrigloria.com?subject=Order%20Inquiry%20-%20${encodeURIComponent(p.title)}&body=I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(p.title)}." target="_blank"><i class="fas fa-shopping-cart"></i> Order</a>
            <button class="btn-inquire btn-with-ripple" data-id="${p.id}"><i class="fas fa-info-circle"></i> Inquire</button>
            <button class="btn-details btn-with-ripple" data-id="${p.id}"><i class="fas fa-eye"></i> Details</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // after DOM nodes are added initialize animations and ripple behavior
    initRevealAnimations();
    attachButtonRipples();
  }

  function populateProductSelect() {
    if (!productSelect) return;
    productSelect.innerHTML = `<option value="">Choose a product</option>` +
      products.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
  }

  function populateComparisonTable() {
    if (!comparisonBody) return;
    comparisonBody.innerHTML = products.map(p => {
      const ourPrice = p.priceNGN;
      const marketAvg = Math.round(ourPrice * 1.12);
      const save = marketAvg - ourPrice;
      const quality = p.featured ? 'Excellent' : 'Good';
      return `
        <tr>
          <td>${p.title}</td>
          <td class="price-cell">${formatPrice( currency === 'NGN' ? ourPrice : (p.priceUSD || +(ourPrice/4200).toFixed(2)), currency)}</td>
          <td>${formatPrice( currency === 'NGN' ? marketAvg : +(marketAvg/4200).toFixed(2), currency)}</td>
          <td class="savings-cell">${formatPrice( currency === 'NGN' ? save : +(save/4200).toFixed(2), currency)}</td>
          <td class="quality-cell"><span class="${quality === 'Excellent' ? 'quality-excellent' : 'quality-good'}">${quality}</span></td>
        </tr>
      `;
    }).join('');
  }

  // --- Reveal animations (intersection observer + stagger) ---
  function initRevealAnimations() {
    const cards = Array.from(document.querySelectorAll('.product-card'));
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const idx = Number(el.dataset.index) || 0;
          // staggered reveal delay
          const delay = Math.min(300, idx * 60);
          el.style.transition = `opacity 550ms cubic-bezier(.2,.9,.2,1) ${delay}ms, transform 550ms cubic-bezier(.2,.9,.2,1) ${delay}ms`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.classList.add('in-view');
          // once revealed, stop observing
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(c => observer.observe(c));
  }

  // --- Stats count-up when visible ---
  function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const parseTarget = el => {
      const raw = el.textContent.trim();
      const digits = raw.match(/\d+/);
      return digits ? Number(digits[0]) : 0;
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stats.forEach((el, i) => {
            const target = parseTarget(el);
            // animate only if number > 0
            if (target > 0) {
              let start = 0;
              const duration = 900 + (i * 150);
              const startTime = performance.now();
              const step = now => {
                const progress = Math.min(1, (now - startTime) / duration);
                const current = Math.floor(progress * target);
                el.textContent = current + (el.textContent.includes('+') ? '+' : '');
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = String(target) + (el.textContent.includes('+') ? '+' : '');
              };
              requestAnimationFrame(step);
            }
            // reveal stat card visual
            el.closest('.stat-card')?.classList.add('in-view');
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const container = document.querySelector('.quick-stats');
    if (container) observer.observe(container);
  }

  // --- Bulk calculator entrance animation ---
  function initBulkAnimation() {
    const bulk = document.querySelector('.bulk-calculator');
    if (!bulk) return;
    bulk.classList.add('bulk-animate');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          bulk.classList.add('in-view');
          obs.unobserve(bulk);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(bulk);
  }

  // --- Button ripple effect for buttons with .btn-with-ripple ---
  function attachButtonRipples() {
    const buttons = document.querySelectorAll('.btn-with-ripple');
    buttons.forEach(btn => {
      // ensure relative (some CSS may already)
      btn.style.position = btn.style.position || 'relative';
      btn.addEventListener('click', function (ev) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${ev.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${ev.clientY - rect.top - size / 2}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
      }, { passive: true });
    });

    // WhatsApp button small entrance pulse
    const wa = document.querySelector('.whatsapp-float');
    if (wa) {
      wa.animate(
        [{ transform: 'translateY(10px)' }, { transform: 'translateY(0)' }],
        { duration: 700, easing: 'cubic-bezier(.2,.9,.2,1)' }
      );
    }
  }

  // --- Filters & controls ---
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category || 'all';
      renderProducts();
    });
  });

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currency = btn.dataset.currency || 'NGN';
      renderProducts();
      populateComparisonTable();
      updateCalculatorResults();
    });
  });

  qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      qtyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // ui-only
    });
  });

  // --- Calculator logic ---
  function calculateDiscountPercent(qty) {
    if (qty >= 500) return 30;
    if (qty >= 200) return 25;
    if (qty >= 100) return 20;
    if (qty >= 50) return 15;
    return 0;
  }

  function getDeliveryCost(qty, location) {
    if (location === 'within-akamkpa') {
      return qty >= 50 ? 0 : 2000;
    }
    if (location === 'cross-river') {
      if (qty >= 100) return 5000;
      return 8000;
    }
    return 20000;
  }

  function updateCalculatorResults() {
    const productId = productSelect ? productSelect.value : '';
    const qty = Math.max(1, Number(quantityInput ? quantityInput.value : 0));
    const loc = deliveryLocation ? deliveryLocation.value : 'within-akamkpa';
    const prod = products.find(p => p.id === productId) || products[0];

    const unitPriceRaw = currency === 'NGN' ? prod.priceNGN : (prod.priceUSD || +(prod.priceNGN / 4200).toFixed(2));
    const discountPercent = calculateDiscountPercent(qty);
    const subtotal = unitPriceRaw * qty;
    const discountAmount = Math.round((discountPercent / 100) * subtotal);
    const deliveryCost = getDeliveryCost(qty, loc);
    const total = subtotal - discountAmount + deliveryCost;

    if (discountPercentEl) discountPercentEl.textContent = `${discountPercent}%`;
    if (unitPriceEl) unitPriceEl.textContent = `${formatPrice(unitPriceRaw, currency)}`;
    if (totalQuantityEl) totalQuantityEl.textContent = `${qty} ${prod.unit.includes('per') ? '' : prod.unit}`;
    if (discountAmountEl) discountAmountEl.textContent = `- ${formatPrice(discountAmount, currency)}`;
    if (deliveryCostEl) deliveryCostEl.textContent = formatPrice(deliveryCost, currency);
    if (totalCostEl) totalCostEl.textContent = formatPrice(total, currency);
  }

  if (qtyMinus) qtyMinus.addEventListener('click', () => {
    if (!quantityInput) return;
    quantityInput.value = Math.max(Number(quantityInput.min || 1), Number(quantityInput.value) - 1);
    updateCalculatorResults();
  });

  if (qtyPlus) qtyPlus.addEventListener('click', () => {
    if (!quantityInput) return;
    quantityInput.value = Math.min(Number(quantityInput.max || 10000), Number(quantityInput.value) + 1);
    updateCalculatorResults();
  });

  if (quantityInput) quantityInput.addEventListener('input', () => updateCalculatorResults());
  if (productSelect) productSelect.addEventListener('change', () => updateCalculatorResults());
  if (deliveryLocation) deliveryLocation.addEventListener('change', () => updateCalculatorResults());

  if (resetCalculatorBtn) resetCalculatorBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (productSelect) productSelect.value = '';
    if (quantityInput) quantityInput.value = 50;
    if (deliveryLocation) deliveryLocation.value = 'within-akamkpa';
    document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.currency-btn[data-currency="NGN"]')?.classList.add('active');
    currency = 'NGN';
    updateCalculatorResults();
    renderProducts();
    populateComparisonTable();
  });

  if (getQuoteBtn) getQuoteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const prod = products.find(p => p.id === (productSelect ? productSelect.value : '')) || products[0];
    const qty = Number(quantityInput ? quantityInput.value : 50);
    const loc = deliveryLocation ? deliveryLocation.value : '';
    const subject = encodeURIComponent(`Quote request: ${prod.title}`);
    const body = encodeURIComponent(`Hello AgriGloria Sales,\n\nPlease send a detailed quote for the following:\n\nProduct: ${prod.title}\nQuantity: ${qty}\nDelivery: ${loc}\nPreferred currency: ${currency}\n\nThank you.`);
    window.location.href = `mailto:sales@agrigloria.com?subject=${subject}&body=${body}`;
  });

  // Populate comparison table
  populateComparisonTable();

  // initial render
  populateProductSelect();
  renderProducts();
  updateCalculatorResults();

  // initialize additional animations that are independent from product render
  initStatsCounter();
  initBulkAnimation();

  // event delegation for product actions
  grid.addEventListener('click', (e) => {
    const inquireBtn = e.target.closest('.btn-inquire');
    const detailsBtn = e.target.closest('.btn-details');

    if (inquireBtn) {
      const id = inquireBtn.dataset.id;
      const p = products.find(x => x.id === id);
      if (!p) return;
      const subject = encodeURIComponent(`Product Inquiry: ${p.title}`);
      const body = encodeURIComponent(`Hello AgriGloria,\n\nI would like to inquire about ${p.title}.\nPlease provide availability, pricing (NGN/USD) and delivery info.\n\nThanks.`);
      window.location.href = `mailto:sales@agrigloria.com?subject=${subject}&body=${body}`;
    }

    if (detailsBtn) {
      const id = detailsBtn.dataset.id;
      const p = products.find(x => x.id === id);
      if (!p) return;
      alert(`${p.title}\n\n${p.description}\n\nFeatures:\n- ${p.features.join('\n- ')}\n\nPrice: ${formatPrice(currency === 'NGN' ? p.priceNGN : (p.priceUSD || +(p.priceNGN/4200).toFixed(2)), currency)}`);
    }
  });

  // WhatsApp order button
  if (whatsappOrder) {
    whatsappOrder.addEventListener('click', (e) => {
      const p = products[0];
      const msg = encodeURIComponent(`Hello AgriGloria, I would like to order: ${p.title}. Please advise availability and pricing.`);
      whatsappOrder.href = `https://wa.me/2348031234567?text=${msg}`;
    });
  }

  // back-to-top visibility
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backToTop.style.display = 'flex';
      else backToTop.style.display = 'none';
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // respond to currency changes elsewhere on page (if any)
  document.addEventListener('currencyChange', () => {
    renderProducts();
    populateComparisonTable();
    updateCalculatorResults();
  });

});